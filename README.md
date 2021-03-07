# mayfes2021-pkyo

## 開発環境
Node

## 初期設定
Nodeをインストールしてこのリポジトリをクローンしたらおまじない

```npm install```

これやるとpackage.jsonにある色々をインストールできます。

```npm run build```

これやるとwebpackが走ります(webpackが何かは気にしなくていいです)

## 実行
```npm start```

これでサーバーが立ち上がる(localhost:hoge~みたいな感じ)ので、それにブラウザでアクセスして下さい。
「手元でソースコードを変更して保存->自動的にコンパイルしてブラウザ上でも更新」ということをしてくれます。

## ソースコードの説明(ざっくりと)

index.jsの内容をbuildのbundle.jsにコピー(?)してそれを組み込んだindex.htmlの内容がwebに反映されています。
今はindex.jsにまとめているけど、分割していきます(可読性がアレなので)

目的とするプログラムは大きく以下の3つになってます。

### web部分(htmlとかcssとか)

style.cssとindex.htmlをいじってくれると助かります。
Blockを組み立てて実行ボタンを押すとキャラクターが動くっていう仕様を想定しているので、そういうボタンとかを追加していってください。

### Phaser部分(index.jsとか)

ゲームエンジン部分です。
index.jsのconfigとかpreload関数とかcreate関数とかupdate関数とかをいじることになりそうです。
まぁゲームの盤面の更新を担っている感じです。
Phaserのドキュメントを頑張って読んでうんたらします。(この部分、正直虚無なので去年のものを丸パクでも良さそう)
参考になりそうなもの。

https://phaser.io/tutorials/making-your-first-phaser-3-game/part5

https://gpnotes.hatenablog.jp/entry/2018/11/19/161739

Phaserのリファレンス(読みづらい)

https://photonstorm.github.io/phaser3-docs/index.html


### blockly部分(今はindex.js内でやろうとしていますが、いつか絶対にファイルを分割します)

ゲームに使われるブロックを定義します。ブロックの定義といっても、GUIでどのように表示されるかを指定する「ガワ」を作る部分と、その実際の機能を定義する部分を実装することになると思います。
今のところ作ったブロックをどうすれば表示できるかがわかっていないので手をつけるのはそこがわかってからですが、4月からはこことステージ作りがメインになると思います。
Blocklyの公式リファレンスです。

https://developers.google.com/blockly/guides/create-custom-blocks/overview

ブロックをGUIで作れるサイト(とてもわかりやすくて良い)

https://blockly-demo.appspot.com/static/demos/blockfactory/index.html

知見が得られそうなサイト(コードがバグっているけど)

https://qiita.com/gakuseikai/items/b13b2888e2f110217ff6


### ステージ作り部分

キャラクターをブロックの命令によって動かすならばタイルマップは必要です。
タイルマップを作成するならばTiledというアプリが良さそうな感じです。
条件分岐やループをいい感じに生かせそうなステージを作りたい感じです。

参考になりそうなサイト

https://1-notes.com/phaser3-create-tile-map-with-tiled/

PhaserにはJSONファイルとして読み込むと思うんですけど、その際に注意することがいくつかあるようです↓

https://www.catch.jp/wiki3/tools/phaser_and_tiled

発展として、キャラを用いないステージ(例えばバブルソートを行うために配列だけを表示するとか)もアリだと思うので、そういう時はタイルマップは不要です。(どうやって実現するかは…)


## やるべきことリスト

早急
- ゲーム画面にブロックを操作する部分を加える(方法を解明したい)
- Phaserによる制御(update部分を書いてキャラがブロックの命令に合わせて動くようにしたい)

正直ここはコピペでもいいと思います(ただし内容は理解した方が良さそう)


急がなくてもいいが、将来やること(暫定)

- キャラクターのアニメーション
- キャラの画像をうまく読み込めていない問題