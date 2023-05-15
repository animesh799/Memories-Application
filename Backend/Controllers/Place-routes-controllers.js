const HttpError = require("../Models/Http-error");
const { validationResult } = require("express-validator");
const getGeocodedAddress = require("../Utils/location");
const Place = require("../Models/Places");
const User = require("../Models/Users");
const mongoose = require("mongoose");
const fs = require("fs");

const getPlaceByUserId = async (req, res, next) => {
  const uId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: uId });
  } catch (err) {
    const error = new HttpError(
      "Something went Wrong,Could not find the place",
      500
    );
    return next(error);
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const getPlaceByPlaceId = async (req, res, next) => {
  const pId = req.params.pid;
  let place;
  try {
    place = await Place.findById(pId);
  } catch (err) {
    const error = new HttpError(
      "Something went Wrong,Could not find the place",
      500
    );
    return next(error);
  }

  if (!place) {
    return next(new HttpError("Could not find Place for given Place ID", 404));
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid data provided,Please provide valid input", 422)
    );
  }

  const { title, address, description } = req.body;
  let coordinates;
  try {
    coordinates = await getGeocodedAddress(address);
  } catch (error) {
    return next(error);
  }

  const addedPlace = new Place({
    title,
    address,
    image: req.file.path,
    description,
    location: coordinates,
    creator: req.userData.userId, //because through req body any userId can be sent
  });

  console.log(req.file, "image url");
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,Try again after sometime",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Cannot find User for given User ID", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await addedPlace.save({ session: sess });
    user.places.push(addedPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("New Place cant be created", 500);
    return next(error);
  }

  res.status(201).json({ place: addedPlace });
};

const editPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError(
      "Invalid data provided,Please provide valid input",
      422
    );
  }
  const { title, description } = req.body;
  const pid = req.params.pid;

  let updatedPlace;

  try {
    updatedPlace = await Place.findById(pid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,Place cant be updated",
      500
    );
    return next(error);
  }

  if (updatedPlace.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to update this place",
      401
    );
    return next(error);
  }

  updatedPlace.title = title;
  updatedPlace.description = description;
  try {
    await updatedPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,Place cant be updated",
      500
    );
    return next(error);
  }

  res.status(200).json({ Place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const pid = req.params.pid;
  let place;
  try {
    place = await Place.findById(pid).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,Connot Delete a place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Cannot find the place with this ID", 404);
    return next(error);
  }

  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this place",
      401 //unauthorized
    );
    return next(error);
  }
  let imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    console.log(place);
    place.creator.places.pull(place); //automatically removes the place behind the scene
    await place.remove({ session: sess });

    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,Connot delete a Place",
      500
    );
    return next(err);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  }); //here we doesent use req.file.path because in req no file is attached its a delete req so that cant be use

  res.status(200).json({ message: "Place Deleted" });
};
exports.deletePlace = deletePlace;
exports.editPlace = editPlace;
exports.createPlace = createPlace;
exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlaceByUserId = getPlaceByUserId;
