#!/usr/bin/env bash
# worker/.dev.vars の内容を本番 Worker secret に一括反映
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEV_VARS="$ROOT/worker/.dev.vars"

# 壊れたシェル環境変数を無効化
unset CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID 2>/dev/null || true

if [[ ! -f "$DEV_VARS" ]]; then
  echo "✗ worker/.dev.vars がありません。先に npm run setup を実行してください"
  exit 1
fi

# 空行・コメント・未入力を除く
if ! grep -qE '^[A-Z_]+=.+' "$DEV_VARS"; then
  echo "✗ worker/.dev.vars に値が入っていません。キーを設定してから再実行してください"
  exit 1
fi

echo "=== Worker secrets を Cloudflare に反映 ==="

cd "$ROOT/worker"
npx wrangler secret bulk "$DEV_VARS"
echo "✓ 完了"
