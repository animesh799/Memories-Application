const axios = require("axios");
const { response } = require("express");
const HttpError = require("../Models/Http-error");


const getGeocodedAddress = async (address) => {
 const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.GOOGLE_API_KEY}`
  );
  const data = response.data;
  if (!data || data.status === "ZERO_RESULTS") {
    throw new HttpError(
      "No valid location is found please recheck the address",
      422
    );
  }
  const coordinates = data.results[0].geometry.location;

  return coordinates;
};

module.exports = getGeocodedAddress;
