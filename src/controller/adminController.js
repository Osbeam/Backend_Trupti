const express = require("express");
const adminController = express.Router();
const adminServices = require("../services/adminServices");
const Admin = require("../model/adminSchema");
const User = require("../model/userSchema")
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

adminController.get("/callstatus/:id", async (req, res) => {
  try {
    const data = await adminServices.getEmployeeCallStatus(req.params.id);
    const user = await User.findOne({_id:req.params.id})
    let obj = {
      CallNotReceived: 0,
      NotInterested: 0,
      Interested: 0,
      SwitchOff: 0,
      Invalid: 0,
      NotExists: 0,
      FollowUp: 0
    };
    for (let i = 0; i < data.length; i++) {
      if (data[i].CallStatus[0] === "CallNotReceived") {
        obj.CallNotReceived += 1;
      } else if (data[i].CallStatus[0] === "NotInterested") {
        obj.NotInterested += 1;
      } else if (data[i].CallStatus[0] === "Interested") {
        obj.Interested += 1;
      } else if (data[i].CallStatus[0] === "SwitchOff") {
        obj.SwitchOff += 1;
      } else if (data[i].CallStatus[0] === "Invalid") {
        obj.Invalid += 1;
      } else if (data[i].CallStatus[0] === "NotExists") {
        obj.NotExists += 1;
      } else if (data[i].CallStatus[0] === "FollowUp") {
        obj.FollowUp += 1;
      }
    }
    obj.user= user
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Call Status retrieved successfully",
      data: obj
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.get("/Allcallstatus", async (req, res) => {
  try {
    const callStatusData = await adminServices.getAllEmployeeCallStatus();
    const users = await User.find(); // Retrieve all users
    
    let userData = [];

    // Loop through each user
    for (const user of users) {
      let obj = {
        user: user,
        statusCounts: {
          CallNotReceived: 0,
          NotInterested: 0,
          Interested: 0,
          SwitchOff: 0,
          Invalid: 0,
          NotExists: 0,
          FollowUp: 0
        }
      };
    
      // Loop through call status data to count status for each user
      for (const data of callStatusData) {
        // Check if data and user are defined and have the necessary properties
        if (data && data.CalledBy && user && user._id && data.CalledBy.toString() === user._id.toString()) {
          const status = data.CallStatus.length > 0 ? data.CallStatus[0] : null; // Check if CallStatus array is not empty
          if (status && obj.statusCounts.hasOwnProperty(status)) {
            obj.statusCounts[status]++;
          }
        }
      }
    
      userData.push(obj);
    }
    

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Call status retrieved successfully",
      data: userData
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


module.exports = adminController;