const { SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER } = require("constants");
const express = require("express");
const Class = require('../models/class');
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

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

router.post("", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const addedClass = new Class({
    className: req.body.className,
    classWeight: req.body.classWeight,
    classDes: req.body.classDes,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId //userid can be decoded from the token
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
  }).catch(error => {
    res.status(500).json({
      message: "Creating a post failed"
    })
  })
});

router.put("/:id", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
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
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Class.updateOne({_id: req.params.id, creator: req.userData.userId }, updatedClass).then(result => {
    console.log(result);
    if (result.nModified > 0){
      res.status(200).json({message: "Post updated brah"});
    } else {
      res.status(401).json({message: "Ya not authorized edit brah"});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post"
    })
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
   })
   .catch(error => {
     res.status(500).json({
       message: "Fetching classes failed"
     })
   });
});

router.get("/:id", (req, res, next) => {
  Class.findById(req.params.id).then(c => {
    if (c){
      res.status(200).json(c);
    }else{
      res.status(404).json({message: "pnf"});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching posts failed"
    })
  });
});
router.delete("/:id", checkAuth, (req, res, next) => {
  Class.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    // console.log("result is: ", result);
    if (result.deletedCount > 0){
      res.status(200).json({message: "Post deleted brah"});
    } else {
      res.status(401).json({message: "Ya not authorized to delete brah" + result.n});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching classes failed"
    })
  });
});

module.exports = router;

