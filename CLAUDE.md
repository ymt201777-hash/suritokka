# 犬山数学理科特化塾 ウェブサイト

塾の公式サイト。素の HTML / CSS / JavaScript のみで作られています。

## 前提

- **ビルド工程なし**。npm もフレームワークも使っていません。HTML を直接編集します
- **各ページが自己完結**しています。CSS は各 HTML の `<style>`、JS は `<script>` に内蔵。共通の外部ファイルは使いません
- `style.css` と `main.js` は**どの HTML からも読み込まれていない残骸**です。編集しても本番に影響しません
- ファイルは LF で保存され git が CRLF に変換します。`LF will be replaced by CRLF` の警告は正常です

## デプロイ

master ブランチに push すると Vercel が自動デプロイします。ステージング環境はありません。

`vercel.json` で `cleanUrls: true` にしているため、**内部リンクは `.html` を付けずに書きます**（`/courses`、`/booking` など）。

旧 `/access` と `/gallery` は `vercel.json` の redirects で `/inuyama` に 301 転送しています。

校舎ページは `inuyama.html` と `iwakura.html` の2枚構成で、互いのページ末尾からリンクし合っています。片方を編集したらもう片方のナビ・共通CSSも揃えてください。

校舎ページには講師セクションがあります（犬山校は3名を薄く、岩倉校は室長を厚めに）。**正式なプロフィールは `instructors.html` に一本化**し、校舎ページ側は肩書と1〜2行に留めてください。学歴や実績を更新するときは `instructors.html` が正、校舎ページは要約です。

## ページ構成

| ファイル | 内容 |
|---|---|
| `index.html` | トップ |
| `instructors.html` | 講師紹介 |
| `results.html` | 合格実績・体験記 |
| `courses.html` | 通常授業 |
| `intensive.html` | 季節講習 |
| `inuyama.html` | 犬山校（授業と自習の拠点。写真・住所・地図） |
| `iwakura.html` | 岩倉校（超集中自習室。写真・住所・地図） |
| `legal.html` | 特定商取引法表記 |
| `booking.html` | 無料体験予約フォーム |
| `apply.html` | 季節講習 申込フォーム |
| `apply-complete.html` | 申込完了ページ |
| `intensive-template.html` | 季節講習ページの雛形（gitignore 済み・ローカル専用） |

## フォーム（サーバーレス構成）

`booking.html` と `apply.html` は **EmailJS + Google Apps Script** で動いています。

- EmailJS を CDN から読み込み、塾宛と申込者宛の2通を送信
- GAS の Web アプリ URL へ POST してスプレッドシートに記録
- キーや URL は各 HTML の `<script>` 冒頭に定数として直書きされています
- 本番の GAS コードは Google 側にあります。リポジトリの `gas-script.gs` は gitignore 対象のローカルメモです

### honeypot の扱い

スパム対策の honeypot 項目がありますが、**値が入っていても送信をブロックしません**。GAS 側でスパム疑いフラグを立てて記録します。パスワードマネージャの自動入力で正規の申込が誤ってブロックされた経緯があるため、この方針を変えないでください。

## 季節講習の運用

季節講習は毎回同じフォーマットです。

1. `intensive-template.html` をベースに `intensive.html` を作る
2. `apply.html` の `COURSES` 配列を、その講習の講座一覧に書き換える

`intensive.html` 末尾の JS に運用フラグが2つあります。

- `MANUAL_OPEN` — 申込ボタンを表示するかどうか
- `CLOSED` — `true` にすると「◯◯講習の申込は終了しました。」というクリック不可の表示に差し替わる

### 開講していない期間（現在この状態）

講習が終わったら、ページは残したまま**到達できない状態**にします。

- `vercel.json` の redirects で `/intensive` と `/apply` をトップへ一時転送（`permanent: false`）
- 全ページのナビから「季節講習」を外す

ファイルは消しません。次の講習で中身を書き換えて再公開します。

### 再公開の手順

1. `vercel.json` の redirects から `/intensive` と `/apply` の2行を削除
2. 全ページのナビに「季節講習」を戻す（PC・スマホの2箇所ずつ）

```html
<!-- nav-links の中、「通常授業」の次 -->
    <li><a href="/intensive">季節講習</a></li>

<!-- mobile-menu の中、「通常授業」の次 -->
  <a href="/intensive">季節講習</a>
```

3. `intensive.html` の中身を新しい講習に更新し、`CLOSED` を `false` に戻す

## SEO / OGP

全ページの `<head>` に以下を入れています。**新しいページを作るときは忘れずに追加してください。**

- `meta name="description"`
- OGP（`og:title` `og:description` `og:url` `og:image` ほか）と `twitter:card`
- `link rel="canonical"`

URL は `https://www.suritokka.com` を基準に、`.html` なしの絶対URLで書きます。OGP画像は全ページ共通で `/ogp.jpg`（1200×630）です。

`index.html` `inuyama.html` `iwakura.html` には JSON-LD の構造化データ（`EducationalOrganization`）が入っています。住所・電話・営業時間を変更したら、ページ本文と構造化データの両方を直してください。

`apply-complete.html` は検索結果に出す必要がないので `noindex` を付けています。

## 画像

写真は **幅900px / JPEG品質88** に統一しています（表示は最大400px幅なので、高解像度ディスプレイでも十分）。新しい写真を追加するときも同じ条件に落としてから置いてください。

1枚目以外の `<img>` には `loading="lazy" decoding="async"` を付けます。

## アナリティクス

GA4（`G-TLJQ87F61R`）を全ページの `<head>` 内、viewport meta の直後に設置しています。
`intensive-template.html` にも入っているので、雛形からコピーしたページにも自動で付いてきます。

**新しいページを作るときは、このタグを忘れずに入れてください。**
