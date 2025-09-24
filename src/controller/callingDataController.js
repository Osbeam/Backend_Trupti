const express = require("express");
const callingDataController = express.Router();
const CallingData = require("../model/callingDataSchema");
const Employee = require("../model/employeeSchema");
const Lead = require("../model/leadSchema");
const LogUser = require("../model/loguserSchema")
const Archive = require("../model/archiveSchema")
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload")
const upload = require("../utils/excelUpload")
const fs = require('fs');
const xlsx = require('xlsx');
const multer = require('multer');
const auth = require('../utils/auth');




callingDataController.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const Employer = req.body.Employer; // Get employer ID from the request body
    const workbook = xlsx.readFile(file.path);
    const sheet_name_list = workbook.SheetNames;
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    // Add employerId to each document
    const dataWithEmployer = jsonData.map(item => ({ ...item, Employer }));
    const uniqueEntries = new Set();
        const deduplicatedData = dataWithEmployer.filter(item => {
          const uniqueKey = item.MobileNo1; // Use MobileNo1 as the unique identifier
          if (!uniqueEntries.has(uniqueKey)) {
            uniqueEntries.add(uniqueKey);
            return true;
          }
          return false;
        });

    const savedData = await CallingData.insertMany(deduplicatedData);
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


CallingData.collection.createIndex({ AssignedTo: 1 });

callingDataController.get("/assign-coldData-for-user/:id", async (req, res) => {
  const startTime = Date.now();

  try {
    const userId = req.params.id;

    // Fetch the employee details with only necessary fields
    const user = await Employee.findById(userId).select('Department').lean();
    if (!user || user.Department !== '666e6eca32b92ee0216a56c5') {
      return sendResponse(res, 200, "Success", {
        success: true,
        message: "Data is only for the Sales Department!"
      });
    }
    console.log(`Employee check: ${Date.now() - startTime}ms`);

    // Check if there is user data with incomplete call status
    const userHandledData = await CallingData.find({
      AssignedTo: userId,
      CallStatus: { $in: [null, []] }
    }).select('_id Name MobileNo1').lean();
    console.log(`Incomplete call status check: ${Date.now() - startTime}ms`);

    if (userHandledData.length > 0) {
      return sendResponse(res, 200, "Success", {
        success: true,
        message: "Some of the user data call status is not updated",
        data: userHandledData
      });
    }

    // Fetch the unassigned data with a limit
    const data = await CallingData.find({ AssignedTo: null }).select('_id Name MobileNo1').limit(1).lean();
    console.log(`Fetch unassigned data: ${Date.now() - startTime}ms`);

    if (data.length === 0) {
      return sendResponse(res, 200, "Success", {
        success: true,
        message: "No data left!"
      });
    }

    // Assign the first unassigned data to the user
    const assignedData = await CallingData.findByIdAndUpdate(
      data[0]._id,
      { AssignedTo: userId },
      { new: true, select: '_id Name MobileNo1' }
    ).lean();
    console.log(`Data assignment: ${Date.now() - startTime}ms`);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Data distributed to employees successfully!",
      data: assignedData,
    });
    console.log(`Total response time: ${Date.now() - startTime}ms`);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


module.exports = callingDataController;