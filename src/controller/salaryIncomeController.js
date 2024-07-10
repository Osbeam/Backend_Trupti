const express = require("express");
const salaryIncome = express.Router();
const salaryServices = require("../services/salaryIncomeServices");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload");



 
salaryIncome.post("/createSalary", async (req, res) => {
  try {
    const userData = { ...req.body };
    const salaryCreated = await salaryServices.createSalaryIncome(userData);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Salary Income form created successfully!",
      userData: salaryCreated,
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


module.exports = salaryIncome;