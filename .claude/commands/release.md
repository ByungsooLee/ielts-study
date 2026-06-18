---
description: 教材ビルド→本番KVへpush→git pushまで一気に反映
---
`tools/release.sh` を実行して、教材(content:push)とコード(git push origin main)を反映してください。
実行前に `git status` で変更内容を要約し、push後に Pages/Worker のデプロイがCIで走る旨を伝えてください。
教材だけ反映したいと言われたら `SKIP_GIT=1 bash tools/release.sh` を使ってください。
