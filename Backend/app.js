const fs = require("fs");
const path = require("path");

const express = require("express");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();

app.use(express.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/users", usersRoutes); // => /api/users...

app.use("/api/places", placesRoutes); // => /api/places...

app.use((req, res, next) => {
  const error = new HttpError("Can Not Find this Route !", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error Occured !" });
});

mongoose
  .connect(
    //`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.iwrbmzd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    `mongodb+srv://cluster0.iwrbmzd.mongodb.net/test?retryWrites=true&w=majority,`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000, (err) => {
      if (err) {
        console.log(err);
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
