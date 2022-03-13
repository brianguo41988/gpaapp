const Class = require('../models/class');

exports.createClass = (req, res, next) => {
  // const url = req.protocol + '://' + req.get("host");
  const addedClass = new Class({
    className: req.body.className,
    classWeight: req.body.classWeight,
    classDes: req.body.classDes,
    // imagePath: url + "/images/" + req.file.filename,
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
        classDes: createdClass.classDes
        // ,imagePath: createdClass.imagePath
      }
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      message: "Creating a post failed"
    })
  })
};

exports.updateClass = (req, res, next) => {
  // let imagePath = req.body.imagePath;
  // if (req.file){ //if we get a image file
  //   const url = req.protocol + '://' + req.get("host");
  //   imagePath = url + "/images/" + req.file.filename;
  // }
  const updatedClass = new Class({
    _id: req.body._id,
    className: req.body.className,
    classWeight: req.body.classWeight,
    classDes: req.body.classDes,
    // imagePath: imagePath,
    creator: req.userData.userId
  });
  Class.updateOne({_id: req.params.id, creator: req.userData.userId }, updatedClass).then(result => {
    if (result.modifiedCount > 0){
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
}

exports.getClasses = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const uid = req.query.uid;
  // console.log("hi");
  let fetchedClasses = [];

  const classQuery = Class.find({creator:uid});
  // const classQuery = Class.find();
  if (pageSize && currentPage){
    classQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  // console.log(classQuery);
  // console.log(classQuery);
     //return all monogodb classes entries
    classQuery.then(documents => {
      console.log("entered then");
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
};

exports.getClass = (req, res, next) => {
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
};

exports.deleteClass = (req, res, next) => {
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
};
