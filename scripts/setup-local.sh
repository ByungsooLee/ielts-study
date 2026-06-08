#!/usr/bin/env bash
# 初回1回: ローカル用の秘密情報ファイルを用意する
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== IELTS Study ローカルセットアップ ==="
echo

# 壊れたシェル環境変数を無効化（README の説明文を export した場合の対策）
unset CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID 2>/dev/null || true

# worker/.dev.vars
if [[ -f "$ROOT/worker/.dev.vars" ]]; then
  echo "✓ worker/.dev.vars は既にあります"
else
  cp "$ROOT/worker/.dev.vars.example" "$ROOT/worker/.dev.vars"
  echo "→ worker/.dev.vars を作成しました。API キーと合言葉を編集してください"
fi

# web/.env.local
if [[ -f "$ROOT/web/.env.local" ]]; then
  echo "✓ web/.env.local は既にあります"
else
  cp "$ROOT/web/.env.local.example" "$ROOT/web/.env.local"
  echo "→ web/.env.local を作成しました。Worker URL と合言葉を編集してください"
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
      # name 行の直後に account_id を挿入
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
echo "1. worker/.dev.vars を編集（SYNC_TOKEN, GOOGLE_TTS_KEY）"
echo "2. web/.env.local を編集（VITE_DEFAULT_SYNC_TOKEN に同じ合言葉）"
echo "3. 本番 Worker へ secret を反映: npm run secrets:push"
echo "4. 開発開始: npm run dev"
echo
echo "※ ターミナルで export CLOUDFLARE_* は不要です（OAuth ログイン + wrangler.toml を使用）"
