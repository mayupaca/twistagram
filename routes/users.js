// .Router関数
const router = require("express").Router();
const User = require("../models/User");

// CRUD
// User update(.put method)
router.put("/:id", async (req, res) => {
  // req.body.userId = ログインしてるuserのid, req.params.id = '/:id'のid(更新したいid)
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      // User schema使う
      // .findByIdAndUpdate関数(userを見つけて更新)mongoose
      const user = await User.findByIdAndUpdate(req.params.id, {
        // $setはUser Schemaのパラメーター(username, email...)全部の指定
        // req.bodyに書き換える
        $set: req.body,
      });
      res.status(200).json("Success Updated!!");
    } catch (err) {
      return res.status(500).json(err);
    }
    // idがマッチしなかった
  } else {
    return res.status(403).json("You can not update this account.");
  }
});
// --------------------------------------------------------------------------------
// User delete(.delete method)
router.delete("/:id", async (req, res) => {
  // req.body.userId = ログインしてるuserのid, req.params.id = '/:id'のid(削除したいid)
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      // User schema使う
      // .findByIdAndDelete関数(userを見つけて削除)
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Success Deleted!!");
    } catch (err) {
      return res.status(500).json(err);
    }
    // idがマッチしなかった
  } else {
    return res.status(403).json("You can not delete this account.");
  }
});

// --------------------------------------------------------------------------------
// User read(.get method)
// 特定のアカウントを見たいとき
router.get("/:id", async (req, res) => {
  try {
    // User schema使う
    // .findById関数(userを見つける)
    // dataからreq.params.idを見つけに行く
    const user = await User.findById(req.params.id);
    // password, updateAtは見えないようにする
    // user._docにそれぞれの情報を取り出して一つ一つ保存(取り出し)
    const { password, updatedAt, ...other } = user._doc;
    // otherだけとってくる
    res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
