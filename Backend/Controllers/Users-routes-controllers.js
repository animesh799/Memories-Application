const HttpError = require("../Models/Http-error");
const { validationResult } = require("express-validator");
const Users = require("../Models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSignUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid data provided,Please provide valid input", 422)
    );
  }
  const { email, password, username } = req.body;

  let existingUser;

  try {
    existingUser = await Users.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Something went wrong,Try again later", 500));
  }

  if (existingUser) {
    return next(new HttpError("User already exist,Login instead", 422));
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Creating user failed,Try again Later", 500));
  }

  const newUser = new Users({
    email,
    name: username,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  });
  try {
    await newUser.save();
  } catch (err) {
    return next(new HttpError("Something went wrong,cannot signup", 500));
  }
  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1hr" }
    );
  } catch (err) {
    return next(new HttpError("Something went wrong,cannot signup", 500));
  }

  res.status(201).json({ userId: newUser.id, email: newUser.email, token });
};
const userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await Users.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Something went wrong,Try again later", 500));
  }

  if (!existingUser) {
    return next(
      new HttpError(
        "Invalid credential,Please enter the correct email or password",
        422
      )
    );
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(new HttpError("Something went wrong,Try again later", 500));
  }

  if (!isValidPassword) {
    return next(
      new HttpError(
        "Invalid credential,Please enter the correct email or password",
        403
      )
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1hr" }
    );
  } catch (err) {
    return next(new HttpError("Something went wrong,cannot login", 500));
  }
  res
    .status(200)
    .json({ userId: existingUser.id, email: existingUser.email, token });
};
const getAllUsers = async (req, res, next) => {
  let allUsers;
  try {
    allUsers = await Users.find({}, "-password");
  } catch (err) {
    return next(
      new HttpError("Fetching user data failed,Try again later", 500)
    );
  }

  if (allUsers.length !== 0) {
    res.status(200).json({
      users: allUsers.map((user) => user.toObject({ getters: true })),
    });
  } else {
    return next(new HttpError("Could not find the user,Create one?", 404));
  }
};

exports.userSignUp = userSignUp;
exports.userLogin = userLogin;

exports.getAllUsers = getAllUsers;
