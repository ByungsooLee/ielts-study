#!/usr/bin/env bash
# 初回1回: ローカル用の秘密情報ファイルを用意する
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== IELTS Study ローカルセットアップ ==="
echo

# 壊れたシェル環境変数を無効化（README の説明文を export した場合の対策）
unset CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID 2>/dev/null || true

read_dev_var() {
  local key="$1"
  local file="$ROOT/worker/.dev.vars"
  [[ -f "$file" ]] || return 0
  grep -E "^${key}=" "$file" | head -1 | cut -d= -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
}

# worker/.dev.vars
if [[ -f "$ROOT/worker/.dev.vars" ]]; then
  echo "✓ worker/.dev.vars は既にあります"
else
  cp "$ROOT/worker/.dev.vars.example" "$ROOT/worker/.dev.vars"
  echo "→ worker/.dev.vars を作成しました。API キーと合言葉を編集してください"
fi

SYNC_TOKEN="$(read_dev_var SYNC_TOKEN)"

# web/.env.local
ENV_LOCAL="$ROOT/web/.env.local"
if [[ ! -f "$ENV_LOCAL" ]]; then
  cp "$ROOT/web/.env.local.example" "$ENV_LOCAL"
  echo "→ web/.env.local を作成しました"
fi

if [[ -n "$SYNC_TOKEN" ]]; then
  if grep -q '^VITE_DEFAULT_SYNC_TOKEN=' "$ENV_LOCAL" 2>/dev/null; then
    if [[ "$(uname)" == "Darwin" ]]; then
      sed -i '' "s|^VITE_DEFAULT_SYNC_TOKEN=.*|VITE_DEFAULT_SYNC_TOKEN=${SYNC_TOKEN}|" "$ENV_LOCAL"
    else
      sed -i "s|^VITE_DEFAULT_SYNC_TOKEN=.*|VITE_DEFAULT_SYNC_TOKEN=${SYNC_TOKEN}|" "$ENV_LOCAL"
    fi
  else
    printf '\nVITE_DEFAULT_SYNC_TOKEN=%s\n' "$SYNC_TOKEN" >>"$ENV_LOCAL"
  fi
  echo "✓ web/.env.local に合言葉を同期しました（worker/.dev.vars と同じ値）"
else
  echo "! worker/.dev.vars の SYNC_TOKEN が空です。編集後に npm run setup を再実行してください"
fi

# wrangler.toml に account_id を書き込み（未設定時のみ）
WRANGLER_TOML="$ROOT/worker/wrangler.toml"
if grep -q '^account_id' "$WRANGLER_TOML" 2>/dev/null; then
  echo "✓ wrangler.toml に account_id があります"
else
  echo
  echo "--- Cloudflare Account ID を wrangler.toml に保存 ---"
  if (cd "$ROOT/worker" && npx wrangler whoami >/tmp/wrangler-whoami.txt 2>&1); then
    ACCOUNT_ID=$(grep -oE '[a-f0-9]{32}' /tmp/wrangler-whoami.txt | head -1)
    if [[ -n "$ACCOUNT_ID" ]]; then
      sed -i '' "/^name = /a\\
account_id = \"$ACCOUNT_ID\"
" "$WRANGLER_TOML" 2>/dev/null || \
      sed -i "/^name = /a account_id = \"$ACCOUNT_ID\"" "$WRANGLER_TOML"
      echo "✓ account_id を wrangler.toml に追加しました"
    else
      echo "! account_id を自動取得できませんでした。npx wrangler login 後に再実行してください"
    fi
  else
    echo "! wrangler 未ログインです。次を実行してから再実行してください:"
    echo "  cd worker && npx wrangler login"
  fi
  rm -f /tmp/wrangler-whoami.txt
fi

echo
echo "=== 次のステップ ==="
echo "1. worker/.dev.vars を編集（SYNC_TOKEN, GOOGLE_TTS_KEY）— 未設定なら"
echo "2. npm run setup を再実行（合言葉を web/.env.local へ同期）"
echo "3. 本番 Worker へ secret を反映: npm run secrets:push"
echo "4. 開発開始: npm run dev（別ターミナルで npm run dev:worker）"
echo
echo "※ ターミナルで export CLOUDFLARE_* は不要です（OAuth ログイン + wrangler.toml を使用）"
