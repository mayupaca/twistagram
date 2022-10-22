const express = require("express");
// app関数の中にexpressを格納してexpressの中のクラスやら関数を使えるようにする
const app = express();
// ローカルサーバーのポート
const PORT = 3000;
// .getメソッドでport3000につながっているか確認
app.get("/", (req, res) => {
  res.send("hello express");
});
// .listenメソッドでサーバー立ち上げ
app.listen(PORT, () => console.log("Start the server"));
