const express = require("express");
const { check } = require("express-validator");
const placesControllers = require("../Controllers/Place-routes-controllers");
const authCheck = require("../middleware/auth-check");
const FileUpload = require("../middleware/File-upload");

const router = express.Router();

router.get("/users/:uid", placesControllers.getPlaceByUserId);

router.get("/:pid", placesControllers.getPlaceByPlaceId);

router.use(authCheck);

router.post(
  "/",
  FileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.editPlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
