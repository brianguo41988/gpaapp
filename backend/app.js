const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const Class = require('./models/class');
const mongoose = require('mongoose');
const classesRoutes = require("./routes/classes");
const userRoutes = require("./routes/user");
const app = express();
app.use(express.static('public'));

mongoose.connect("mongodb+srv://brianguo:jBw739r2@cluster0.p36v5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to Database');
  })
  .catch(() => {
    console.log('Connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Access-Control-Allow-Headers, Authorization, *"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT, *");
  next();
});

app.use("/", express.static(path.join(__dirname, "../dist/gpaApp")));

app.use("/images", express.static(path.join("backend/images"))); //allows for image requests

app.use('/html-images/', express.static('public'));

app.use("/api/classes", classesRoutes);

app.use("/api/user", userRoutes);

app.use("/profile", userRoutes);

app.use("/api/user/signup", userRoutes);

module.exports = app;
