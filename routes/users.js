// .Router関数
const router = require("express").Router();
const User = require("../models/User");

// User register
router.post("/register", async (req, res) => {
  try {
    // Userをインスタンス化
    const newUser = await new User({
      // req.bodyはrequestに含まれるbody要素の中のusername
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const user = await newUser.save()
    return res.status(200).json(user)
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
