const multer = require("multer");
const { v1: uuid } = require("uuid");
const { storage } = require("../cloudinary/index");

const FileUpload = multer({ storage });

module.exports = FileUpload;
