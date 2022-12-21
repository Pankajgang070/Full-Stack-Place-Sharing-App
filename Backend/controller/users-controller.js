const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Someting went wrong, Try Again later !", 500);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid User Input !", 422));
  }

  const { name, email, password } = req.body;

  let alreadyExists;
  try {
    alreadyExists = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Someting went wrong, Try Again later !", 500);
    return next(error);
  }

  if (alreadyExists) {
    return next(new HttpError("Email Already Exists !", 422));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new Error("Could not Create User, Try again Later!");
    return next(error);
  }

  const user = new User({
    name, //name: name
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError("Someting went wrong, Try Again later !", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new Error("SignUp failed, Please try Again Later!");
    return next(error);
  }

  res.status(201).json({ userId:user.id, email: user.email, token: token });
};


const login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Someting went wrong, Try Again later !", 500);
    return next(error);
  }

  if (!user) {
    return next(new HttpError("Either Username or Password is Wrong !", 403));
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new Error(
      "Could not login, Please Check your credentials & try again!"
    );
    return next(error);
  }

  if (!isValidPassword) {
    return next(new HttpError("Invalid Credentials, could not login!", 403));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new Error("Login failed, Please try Again Later!");
    return next(error);
  }

  res.json({ userId:user.id, email: user.email, token: token });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
