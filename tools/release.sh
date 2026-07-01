#!/usr/bin/env bash
# ============================================================
# ワンショット反映: 教材ビルド → git push（CIでデプロイ）
# 教材配信は Pages 静的シャード(/content/**) に一本化されているため、
# Worker KV への content:push は行わない（教材は git push → Pages CI で反映）。
# 進捗の同期は Worker /progress で継続（クライアント側で自動同期）。
#
# 使い方:
#   bash tools/release.sh                 # 教材+コードを一気に反映
#   SKIP_GIT=1 bash tools/release.sh       # 教材ビルドのみ（コミット/プッシュなし）
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

  # ドリル系(task1/writing/speaking): Cowork の content-src 直下のセクション別JSONを同期。
  # 命名規則 section-N.json。task1build.js / opinionbuild.js が読んでシャードを生成。
  for sub in task1 writing speaking; do
    DR_SRC="$IELTS/content-src/$sub"
    if [ -d "$DR_SRC" ]; then
      mkdir -p "$APP/content-src/$sub"
      dr_copied=0
      for src in "$DR_SRC"/section-*.json; do
        [ -f "$src" ] || continue
        cp "$src" "$APP/content-src/$sub/"
        echo "   ✓ $sub/$(basename "$src")"
        dr_copied=$((dr_copied+1))
      done
      [ "$dr_copied" = 0 ] && echo "   ⚠ $sub セクションが見つかりません（スキップ）"
    else
      echo "   ⚠ $DR_SRC が見つかりません（スキップ）"
    fi
  done
else
  echo "   ⚠ IELTS フォルダが見つかりません: $IELTS（スキップ）"
fi

echo "▶ 1) 教材JSONを再生成（content-src → web/public/content/**）"
npm run content:build

if [ "${SKIP_GIT:-0}" = "1" ]; then
  echo "⏭ SKIP_GIT=1: gitコミット/プッシュをスキップ。"
  echo "✅ 教材ビルドのみ 完了"
  exit 0
fi

echo "▶ 2) gitへコミット"
git add -A
git commit -m "content: update $(date +%F)" || { echo "   （変更なし）"; }

if [ "${SKIP_PUSH:-0}" = "1" ]; then
  echo "⏭ SKIP_PUSH=1: pushせず終了（手動でgit push）。"
  exit 0
fi

echo "▶ 3) git push origin main（GitHub Actions が Pages/Worker をデプロイ）"
git push origin main
echo "✅ 反映完了（教材＝Pages, コード＝CIデプロイ後に反映）"
