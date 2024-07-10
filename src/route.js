const express = require("express");
const router = express.Router();
const imgUpload = require("./utils/imageUpload")

const userController = require("./controller/userController");
const departmentcontroller = require("./controller/departmentcontroller");
const formController = require("./controller/formController");
const adminController = require("./controller/adminController");
const salaryIncomeController = require("./controller/salaryIncomeController");
const bussinessIncomeController = require("./controller/bussinessIncomeController");

router.use("/user", userController);
router.use("/department", departmentcontroller);
router.use("/form", formController);
router.use("/admin", adminController);
router.use("/salaryIncome", salaryIncomeController);
router.use("/bussinessIncome", bussinessIncomeController);




module.exports = router;