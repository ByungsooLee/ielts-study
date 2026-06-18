#!/usr/bin/env bash
# ============================================================
# ワンショット反映: 教材ビルド → 本番KVへpush → git push（CIでデプロイ）
# Claude Code から実行する想定（Leeのgit/Cloudflare認証を使用）。
#
# 前提（1回だけ設定）:
#   - SYNC_TOKEN を web/.env.local か worker/.dev.vars に保存、または環境変数で渡す
#   - git push 認証（SSH鍵/GitHub）が通ること
#
# 使い方:
#   bash tools/release.sh                 # 教材+コードを一気に反映
#   SKIP_GIT=1 bash tools/release.sh       # 教材(content:push)だけ反映
#   SKIP_PUSH=1 bash tools/release.sh      # commitまで（pushしない）
# ============================================================
set -euo pipefail

APP="/Users/lee/Documents/ielts-study"
cd "$APP"

echo "▶ 1) 教材JSONを再生成（content-src → web/public/content + sample + index）"
npm run content:build

echo "▶ 2) 本番KVへ教材をpush（content:push）"
# SYNC_TOKEN は web/.env.local / worker/.dev.vars から自動読込される想定。
# 無ければ環境変数 SYNC_TOKEN=... を付けて実行。
npm run content:push
echo "   → KV /content 更新。dev・本番アプリは次回取得で反映。"

if [ "${SKIP_GIT:-0}" = "1" ]; then
  echo "⏭ SKIP_GIT=1: gitコミット/プッシュをスキップ。"
  echo "✅ 教材のみ反映 完了"
  exit 0
fi

echo "▶ 3) gitへコミット"
git add -A
git commit -m "content: update $(date +%F)" || { echo "   （変更なし）"; }

if [ "${SKIP_PUSH:-0}" = "1" ]; then
  echo "⏭ SKIP_PUSH=1: pushせず終了（手動でgit push）。"
  exit 0
fi

echo "▶ 4) git push origin main（GitHub Actions が Pages/Worker をデプロイ）"
git push origin main
echo "✅ 一気に反映 完了（教材=即時KV / コード=CIデプロイ後に反映）"
