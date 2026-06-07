#!/usr/bin/env bash
# GitHub Secrets に登録する前後で、Cloudflare 認証情報をローカル検証する。
# 使い方:
#   export CLOUDFLARE_API_TOKEN="あなたのトークン"
#   export CLOUDFLARE_ACCOUNT_ID="32文字のAccount ID"
#   ./scripts/verify-cloudflare-secrets.sh

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok() { echo -e "${GREEN}✓${NC} $1"; }
ng() { echo -e "${RED}✗${NC} $1"; }
warn() { echo -e "${YELLOW}!${NC} $1"; }

echo "=== Cloudflare Secrets 検証 ==="
echo

# 1. 環境変数の存在
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  ng "CLOUDFLARE_API_TOKEN が未設定です"
  echo "  export CLOUDFLARE_API_TOKEN=\"...\" を実行してから再試行してください。"
  exit 1
fi
ok "CLOUDFLARE_API_TOKEN が設定されています（長さ: ${#CLOUDFLARE_API_TOKEN} 文字）"

if [ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then
  ng "CLOUDFLARE_ACCOUNT_ID が未設定です"
  echo "  Cloudflare Dashboard 右サイドバー → Account ID をコピーして設定してください。"
  exit 1
fi

# 2. Account ID 形式
if [ "${#CLOUDFLARE_ACCOUNT_ID}" -ne 32 ]; then
  ng "CLOUDFLARE_ACCOUNT_ID の長さが 32 文字ではありません（現在: ${#CLOUDFLARE_ACCOUNT_ID}）"
  echo "  前後の空白・改行が入っていないか確認してください。"
  exit 1
fi
if ! echo "$CLOUDFLARE_ACCOUNT_ID" | grep -qE '^[a-f0-9]{32}$'; then
  ng "CLOUDFLARE_ACCOUNT_ID は 32 文字の英小文字+数字（hex）である必要があります"
  exit 1
fi
ok "CLOUDFLARE_ACCOUNT_ID の形式は正しいです"

# 3. トークン検証（/user/tokens/verify）
echo
echo "--- API トークン検証 ---"
VERIFY_JSON=$(curl -sS -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json")

if echo "$VERIFY_JSON" | grep -q '"success":true'; then
  ok "API トークンは有効です"
  echo "$VERIFY_JSON" | python3 -c "
import json,sys
d=json.load(sys.stdin).get('result',{})
print('  ステータス:', d.get('status','?'))
" 2>/dev/null || true
else
  ng "API トークンが無効です"
  echo "$VERIFY_JSON" | python3 -m json.tool 2>/dev/null || echo "$VERIFY_JSON"
  exit 1
fi

# 4. アカウントへのアクセス
echo
echo "--- アカウントアクセス確認 ---"
ACCOUNT_JSON=$(curl -sS -X GET "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json")

if echo "$ACCOUNT_JSON" | grep -q '"success":true'; then
  ok "指定した Account ID にアクセスできます"
  echo "$ACCOUNT_JSON" | python3 -c "
import json,sys
r=json.load(sys.stdin).get('result',{})
print('  アカウント名:', r.get('name','?'))
" 2>/dev/null || true
else
  ng "Account ID にアクセスできません（トークンの Account Resources 設定を確認）"
  echo "$ACCOUNT_JSON" | python3 -m json.tool 2>/dev/null || echo "$ACCOUNT_JSON"
  exit 1
fi

# 5. Workers スクリプト一覧（デプロイ権限の目安）
echo
echo "--- Workers 権限確認 ---"
WORKERS_JSON=$(curl -sS -X GET "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/scripts" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json")

if echo "$WORKERS_JSON" | grep -q '"success":true'; then
  ok "Workers Scripts へのアクセス OK（デプロイ権限あり）"
  if echo "$WORKERS_JSON" | grep -q 'ielts-study-worker'; then
    ok "ielts-study-worker が見つかりました"
  else
    warn "ielts-study-worker はまだ見つかりません（初回デプロイ前なら正常）"
  fi
else
  ng "Workers Scripts へのアクセス失敗（Workers Scripts Edit 権限が必要）"
  echo "$WORKERS_JSON" | python3 -m json.tool 2>/dev/null || echo "$WORKERS_JSON"
  exit 1
fi

# 6. Pages プロジェクト一覧
echo
echo "--- Pages 権限確認 ---"
PAGES_JSON=$(curl -sS -X GET "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json")

if echo "$PAGES_JSON" | grep -q '"success":true'; then
  ok "Cloudflare Pages へのアクセス OK（デプロイ権限あり）"
  if echo "$PAGES_JSON" | grep -q 'ielts-study'; then
    ok "ielts-study プロジェクトが見つかりました"
  else
    warn "ielts-study プロジェクトはまだ見つかりません（初回デプロイで自動作成される場合あり）"
  fi
else
  ng "Cloudflare Pages へのアクセス失敗（Cloudflare Pages Edit 権限が必要）"
  echo "$PAGES_JSON" | python3 -m json.tool 2>/dev/null || echo "$PAGES_JSON"
  exit 1
fi

echo
echo -e "${GREEN}=== すべての検証に合格しました ===${NC}"
echo "この CLOUDFLARE_API_TOKEN と CLOUDFLARE_ACCOUNT_ID を"
echo "GitHub → ielts-study → Settings → Secrets and variables → Actions"
echo "の Repository secrets に登録してください。"
echo
echo "登録後: Actions → Deploy → Run workflow で再実行"
