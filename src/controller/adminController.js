const express = require("express");
const adminController = express.Router();
const adminServices = require("../services/adminServices");
const Admin = require("../model/adminSchema");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload")
const upload = require("../utils/excelUpload")
// const {excelUpload} = require('../utils/excel'); // Ensure this path points to your excelUpload middleware
const { saveExcelDataToDB } = require('../services/adminServices'); // Adjust the path as necessary
const { processExcelFile } = require('../services/adminServices');
const fs = require('fs');
const xlsx = require('xlsx');
const multer = require('multer');

// const upload = multer({ dest: 'uploads/' });


adminController.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const Employer = req.body.Employer; // Get employer ID from the request body
    const workbook = xlsx.readFile(file.path);
    const sheet_name_list = workbook.SheetNames;
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    // Add employerId to each document
    const dataWithEmployer = jsonData.map(item => ({ ...item, Employer }));

    const savedData = await Admin.insertMany(dataWithEmployer);
    sendResponse(res, 200, 'Success', {
      success: true,
      message: 'Excel file uploaded and data saved successfully',
      data: savedData
    });
  } catch (error) {
    console.error('Error uploading Excel file:', error);
    sendResponse(res, 500, 'Failed', {
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});



adminController.get("/getexcelfiles", async (req, res) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 10;
    const data = await adminServices.getAllFiles(currentPage, pageSize);
    const userCount = await Admin.countDocuments();
    const totalPage = Math.ceil(userCount / 10);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "All Excel list retrieved successfully!",
      data: data, userCount, totalPage, currentPage
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.post('/manualDataUpload', async (req, res) => {
  try {

    const userData = { ...req.body }; // Add employee ID to user data
    const dataCreated = await adminServices.createData(userData);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Manually Data Uploaded Successfully!",
      userData: dataCreated
    });

  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.put("/updatedata", async (req, res) => {
  try {
    const data = await adminServices.updateData({ _id: req.body._id }, req.body);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Data Updated successfully!",
      data: data
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});




module.exports = adminController;