const mongoose = require("mongoose");
// mongooseの中にある.Schemaクラスを使う
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String, // 絶対必要項目にはrequired: true
      required: true,
      min: 3,
      max: 25,
      unique: true, //他の人と重複できない
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 50,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 70,
    },
    city: {
      type: String,
      max: 50,
    },
  },
  { timestamps: true }
);

// 第一引数は他のファイルで使えるようにする名前
// UserSchemaをUserという名前でexport
module.exports = mongoose.model('User', UserSchema)