const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts");
const cargosRoutes = require("./routes/cargos");
const transportsRoutes = require("./routes/transports");
const userRoutes = require("./routes/user");
const trucksRoutes = require("./routes/trucks");
const signupsRoutes = require("./routes/signups");
const profilesRoutes = require("./routes/profiles");

const app = express();

mongoose
  .connect(
    "mongodb+srv://nbalog:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0.tfize.mongodb.net/rasingo", { useFindAndModify: false }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/cargos", cargosRoutes);
app.use("/api/transports", transportsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/trucks", trucksRoutes);
app.use("/api/signups", signupsRoutes);
app.use("/api/profile", profilesRoutes);
module.exports = app;
