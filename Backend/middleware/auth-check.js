const HttpError = require("../Models/Http-error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
      }
  try {
    const token = req.headers.authorization.split(" ")[1]; //"bearer token"

    if (!token) {
      throw new Error("Authentication failed");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    next(new HttpError("Authentication failed", 403));
  }
};
