const User = require("../models/user");

exports.getClass = (req, res, next) => {
  const uid = req.query.uid;
  let fetchedUser = [];

  const classQuery = User.find({_id:uid});
     //return all monogodb classes entries
    classQuery.then(documents => {
      console.log("entered then");
      fetchedUser = documents;
      return User.count();
    }).then(count => {
      res.status(200).json({
        message: 'User fetched successfully',
        classes: fetchedUser,
      });
   })
   .catch(error => {
     res.status(500).json({
       message: "Fetching User failed"
     })
   });
};



