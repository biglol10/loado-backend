const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "이름을 입력해주세요"],
  },
  userId: {
    type: String,
    required: [true, "아이디가 필요합니다"],
    unique: true,
    match: [
      /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      "Please add a valid Id",
    ],
  },
  password: {
    type: String,
    required: [true, "비밀번호를 입력해주세요"],
    minlength: 2,
    select: false, // when we get user through api it is not going to be shown
  },
  lastLogin: {
    type: String,
  },
});

// Encrypt password using bcrypt (acts like middleware before saving user)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  // below is only runed if the password is actually modified
  const salt = await bcrypt.genSalt(10);
  // when we have middleware like this, we have access to the field. So, this.password is password in Users.create({password:'123456'})
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
// Since this is a method it is going to be called on actual user, so we have access to the users field meaning we have access to the hashed password
// enteredPassword is plain text and this.password is password from database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", UserSchema);
