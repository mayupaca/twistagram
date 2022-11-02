const router = require("express").Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage });
// Upload picture api
// この"file"はkeyになる
router.post("/", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("Success uploaded picture!!");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
