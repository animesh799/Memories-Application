const Mongoose = require("mongoose");

const placesSchema = new Mongoose.Schema({
  title: { type: String, required: true },
  address: { type: String, required: true },
  creator: { type: Mongoose.Types.ObjectId, required: true, ref: "User" },

  image: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

const Place = Mongoose.model("Place", placesSchema);

module.exports = Place;
