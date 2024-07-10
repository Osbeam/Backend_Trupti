const express = require("express");
const bussinessIncome = express.Router();
const bussinessServices = require("../services/bussinessIncomeServices");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload");



 
bussinessIncome.post("/createBussiness", async (req, res) => {  
  try {
    const userData = { ...req.body };
    const bussinessCreated = await bussinessServices.createBussinessIncome(userData);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Bussiness Income form created successfully!",
      userData: bussinessCreated,
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


module.exports = bussinessIncome;