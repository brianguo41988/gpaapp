const express = require("express");

const router = express.Router();

const UserController = require("../controllers/user");

const ProfileController = require("../controllers/profile");

router.post("/signup", UserController.createUser);
 // "User" is in reference to mongodb?
router.post("/login", UserController.userLogin);

router.get("/signup", ProfileController.getClass);

module.exports = router;
