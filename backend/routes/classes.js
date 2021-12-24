const { SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER } = require("constants");
const express = require("express");
const Class = require('../models/class');
const router = express.Router();
const multer = require("multer");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid){
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const addedClass = new Class({
    className: req.body.className,
    classWeight: req.body.classWeight,
    classDes: req.body.classDes,
    imagePath: url + "/images/" + req.file.filename
  });
  // save() saves into mongodb
  addedClass.save().then(createdClass => {
    res.status(201).json({
      message: 'Class added successfully',
      // classId: createdClass._id
      addedClass: {
        _id: createdClass._id,
        className: createdClass.className,
        classWeight: createdClass.classWeight,
        classDes: createdClass.classDes,
        imagePath: createdClass.imagePath
      }
    });
  });
});

router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file){ //if we get a image file
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const updatedClass = new Class({
    _id: req.body._id,
    className: req.body.className,
    classWeight: req.body.classWeight,
    classDes: req.body.classDes,
    imagePath: imagePath
  });
  Class.updateOne({_id: req.params.id}, updatedClass).then(result => {
    console.log(result);
    res.status(200).json({message: "Post updated brah"});
  });
});

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const classQuery = Class.find();
  let fetchedClasses;
  if (pageSize && currentPage){
    classQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
     //return all monogodb classes entries
    classQuery.then(documents => {
      fetchedClasses = documents;
      return Class.count();
    }).then(count => {
      res.status(200).json({
        message: 'Classes fetched successfully',
        classes: fetchedClasses,
        maxPosts: count
      });
   });
});

router.get("/:id", (req, res, next) => {
  Class.findById(req.params.id).then(c => {
    if (c){
      res.status(200).json(c);
    }else{
      res.status(404).json({message: "pnf"});
    }
  })
})
router.delete("/:id", (req, res, next) => {
  Class.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: "Post deleted brah"});
  });
});

module.exports = router;

