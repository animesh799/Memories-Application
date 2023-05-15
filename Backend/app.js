const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const placeRouter = require("./Routes/Places-routes");
const userRouter = require("./Routes/Users-routes");
const httpError = require("./Models/Http-error");
const Mongoose = require("mongoose");
const fs = require("fs");
const HttpError = require("./Models/Http-error");

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Accept,Content-Type,Origin,X-Requested-With,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  next();
});


app.use("/api/places/", placeRouter);
app.use("/api/users/", userRouter);

app.use((req,res,next)=>{
  const error=new HttpError('Could not find this Route.',404)
  throw error
})


app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.status || 500);
  res.json({ message: error.message || "Something went wrong" });
});

Mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jujre.mongodb.net/${process.env.DATA_BASE}?retryWrites=true&w=majority`
 //connecting to specified db
)
  .then(() => {
    console.log("Database Connected");
    app.listen(process.env.PORT || 5000);
  })
  .catch((error) => console.log(error));

