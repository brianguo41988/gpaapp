const { SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER } = require("constants");
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const ClassController = require("../controllers/classes");

// router.post("", checkAuth, multer({storage: storage}).single("image"), ClassController.createClass);
// router.post("", checkAuth, extractFile, ClassController.createClass);
router.post("", checkAuth, ClassController.createClass);

router.put("/:id", checkAuth, extractFile, ClassController.updateClass);

router.get("", ClassController.getClasses);

// router.get("/:id", ClassController.getClass);

router.delete("/:id", checkAuth, ClassController.deleteClass);

module.exports = router;

