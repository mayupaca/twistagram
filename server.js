const express = require("express");
// app関数の中にexpressを格納してexpressの中のクラスやら関数を使えるようにする
const app = express();
// routes directoryを使えるようにする
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
// ローカルサーバーのポート
const PORT = 5000;
const mongoose = require("mongoose");
const path = require("path")
// .config関数
require("dotenv").config();

// MongoDBと接続
// .connect関数
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("Connecting database...");
  })
  .catch((err) => {
    console.log(err);
  });

// middleware
// .useメソッド
app.use("/images", express.static(path.join(__dirname, "public/images")))
app.use(express.json());
// users.jsの / に /api/usersをデフォルトにした 
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/upload", uploadRoute);


// .getメソッドでport3000につながっているか確認
// root end point
// .getはbrowserに返す
app.get("/", (req, res) => {
  res.send("hello express");
});
// .listenメソッドでサーバー立ち上げ
app.listen(PORT, () => console.log(`Server is listening port ${PORT}...`));
