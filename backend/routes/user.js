const express = require("express");

const router = express.Router();

const UserController = require("../controllers/user");

const ProfileController = require("../controllers/profile");

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("/signup", ProfileController.getClass);

module.exports = router;
