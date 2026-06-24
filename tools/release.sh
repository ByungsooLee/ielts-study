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
IELTS="${IELTS_SRC:-/Users/lee/Claude/Projects/IELTS}"
cd "$APP"

# 0) IELTS（Cowork 編集フォルダ）から最新教材を content-src に取り込み。
#    フォルダが存在し各ファイルが新しければ上書きコピー。
#    number-ledger.json は repo 側に grammar/engineering の n が追記されているため、
#    そのまま上書きするとそれらの番号が消える。md2json.js が自動で追記する設計なので
#    repo 側のレッジを優先し、ここではコピーしない。
echo "▶ 0) IELTS フォルダから content-src へ最新教材を取り込み"
if [ -d "$IELTS" ]; then
  for f in "単語マスターリスト.md" "ielts-vocab-data.js"; do
    if [ -f "$IELTS/$f" ]; then
      cp "$IELTS/$f" "$APP/content-src/$f"
      echo "   ✓ $f"
    else
      echo "   ⚠ $IELTS/$f が見つかりません（スキップ）"
    fi
  done
  # 面接(interview)コレクション: ジャンル別シャードを content-src/interview/ へ同期。
  # grammar 同様、md2json.js がここを読んでシャード＋index へ反映する。
  # genre-2.json 等のデモ仮データは取り込まない（実データのみ。命名規則 genre-N.json）。
  IV_SRC="$IELTS/content/engineering/interview"
  if [ -d "$IV_SRC" ]; then
    mkdir -p "$APP/content-src/interview"
    iv_copied=0
    for src in "$IV_SRC"/genre-*.json; do
      [ -f "$src" ] || continue
      cp "$src" "$APP/content-src/interview/"
      echo "   ✓ interview/$(basename "$src")"
      iv_copied=$((iv_copied+1))
    done
    [ "$iv_copied" = 0 ] && echo "   ⚠ interview シャードが見つかりません（スキップ）"
  fi
else
  echo "   ⚠ IELTS フォルダが見つかりません: $IELTS（スキップ）"
fi

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
