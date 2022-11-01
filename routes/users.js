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
// router.get("/:id", async (req, res) => {
//   try {
// User schema使う
// .findById関数(userを見つける)
// /:idで指定したdataからreq.params.idを見つけに行く
// const user = await User.findById(req.params.id);
// password, updateAtは見えないようにする
// user._docにそれぞれの情報を取り出して一つ一つ保存(取り出し)
// const { password, updatedAt, ...other } = user._doc;
// otherだけとってくる
//     return res.status(200).json(other);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });
// --------------------------------------------------------------------------------
// Get user information by query
// 特定のアカウントを見たいとき
router.get("/", async (req, res) => {
  // .queryを使ってuserIdとusernameを取得
  // ---/.../+++?userId=mayumuraの'mayumura'をreq.query.userIdが見てる
  // ---/.../+++?username=mayumuraの'mayumura'をreq.query.usernameが見てる
  // '?'以降をそれぞれの変数に格納している
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    // userIdがあったら、そのuserIdを.findByIdで見つけてくる
    // なかったら、usernameを使って.findOneで見つける
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    // password, updateAtは見えないようにする
    // user._docにそれぞれの情報を取り出して一つ一つ保存(取り出し)
    const { password, updatedAt, ...other } = user._doc;
    // otherだけとってくる
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// --------------------------------------------------------------------------------
// User follow(.put method)
// :idはフォローしたいid
router.put("/:id/follow", async (req, res) => {
  // 自分自身と同じidはフォローできない
  // req.body.userId = 自分のID, req.params.id = URLのパラメーターのid
  if (req.body.userId !== req.params.id) {
    try {
      // followしたい相手を見つける
      const user = await User.findById(req.params.id);
      // 自分自身
      const currentUser = await User.findById(req.body.userId);
      // currentUserがuserをfollowしているかしていないか条件分岐
      // 今からfollowするuserがcurrentUserをfollowerとして持っていなければ...
      if (!user.followers.includes(req.body.userId)) {
        // currentUserをuserにpush
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        // userをcurrentUserにpush
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("Following!");
      } else {
        return res.status(403).json("You are already following this user.");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("You can not follow yourself.");
  }
});
// --------------------------------------------------------------------------------
// User unfollow(.put method)
// :idはフォロー解除したいid
router.put("/:id/unfollow", async (req, res) => {
  // 自分自身と同じidはフォローできない
  // req.body.userId = 自分のID, req.params.id = URLのパラメーターのid
  if (req.body.userId !== req.params.id) {
    try {
      // followしたい相手を見つける
      const user = await User.findById(req.params.id);
      // 自分自身
      const currentUser = await User.findById(req.body.userId);
      // currentUserがuserをfollowしているかしていないか条件分岐
      // unfollowしたいcurrentUserをfollowerとしていたら...
      if (user.followers.includes(req.body.userId)) {
        // currentUserをuserからpull
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        });
        // userをcurrentUserからpull
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("Unfollowing!");
      } else {
        return res.status(403).json("You are already unfollowing this user.");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("You can not unfollow yourself.");
  }
});

module.exports = router;
