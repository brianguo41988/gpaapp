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
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Access-Control-Allow-Headers, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
});

app.use("/", express.static(path.join(__dirname, "../dist/gpaApp")));

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "../dist/gpaApp/index.html"));
// })

// app.post("/api/classes", (req, res, next) => {
//   const addedClass = new Class({
//     className: req.body.className,
//     classWeight: req.body.classWeight,
//     classDes: req.body.classDes
//   });
//   // save() saves into mongodb
//   addedClass.save().then(createdClass => {
//     res.status(201).json({
//       message: 'Class added successfully',
//       classId: createdClass._id
//     });
//   });
// });

// app.put("/api/classes/:id", (req, res, next) => {
//   const updatedClass = new Class({
//     _id: req.body._id,
//     className: req.body.className,
//     classWeight: req.body.classWeight,
//     classDes: req.body.classDes
//   });
//   Class.updateOne({_id: req.params.id}, updatedClass).then(result => {
//     console.log(result);
//     res.status(200).json({message: "Post updated brah"});
//   });
// });

// app.get("/api/classes", (req, res, next) => {
//   Class.find() //return all monogodb classes entries
//     .then(documents => {
//       res.status(200).json({
//         message: 'Classes fetched successfully',
//         classes: documents
//       });
//     });
// });

// app.get("/api/classes/:id", (req, res, next) => {
//   Class.findById(req.params.id).then(c => {
//     if (c){
//       res.status(200).json(c);
//     }else{
//       res.status(404).json({message: "pnf"});
//     }
//   })
// })
// app.delete("/api/classes/:id", (req, res, next) => {
//   Class.deleteOne({_id: req.params.id}).then(result => {
//     console.log(result);
//     res.status(200).json({message: "Post deleted brah"});
//   });
// });
app.use("/images", express.static(path.join("backend/images"))); //allows for image requests
app.use('/html-images/', express.static('public'))
app.use("/api/classes", classesRoutes);
app.use("/api/user", userRoutes);
app.use("/profile", userRoutes);
app.use("/api/user/signup", userRoutes);
module.exports = app;
