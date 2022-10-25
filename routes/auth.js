// .Router関数
const router = require("express").Router();
const User = require("../models/User");

// User register
router.post("/register", async (req, res) => {
  try {
    // Userをインスタンス化
    const newUser = await new User({
      // req.bodyはuserから送られるrequestに含まれるbody要素
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // .findOne関数(mongoose)
    // ログインをするためにemailを使ってuserを探してくる
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("Can not find the user:(");
    // emailから取得したuserのpasswordと入力されたpasswordが合ってるか確認
    const validPassword = req.body.password === user.password;
    if (!validPassword) return res.status(400).json("Incorrect password");
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// router.get("/", (req, res) => {
//   res.send("auth router");
// });

module.exports = router;
