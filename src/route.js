const express = require("express");
const router = express.Router();
const imgUpload = require("./utils/multer")

const userController = require("./controller/userController");

router.use("/user", userController);




module.exports = router;