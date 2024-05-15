const express = require("express");
const router = express.Router();
const imgUpload = require("./utils/multer")

const userController = require("./controller/userController");
const departmentcontroller = require("./controller/departmentcontroller");
const formController = require("./controller/formController");

router.use("/user", userController);
router.use("/department", departmentcontroller);
router.use("/form", formController);




module.exports = router;