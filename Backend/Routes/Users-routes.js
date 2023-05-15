const express = require("express");
const { check } = require("express-validator");
const FileUpload = require("../middleware/File-upload");

const userController = require("../Controllers/Users-routes-controllers");

const router = express.Router();

router.get("/", userController.getAllUsers);

router.post(
  "/signup",
  FileUpload.single("image"),
  [
    check("username").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userController.userSignUp
);

router.post("/login", userController.userLogin);

module.exports = router;
