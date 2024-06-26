const express = require("express");
const adminController = express.Router();
const adminServices = require("../services/adminServices");
const Admin = require("../model/adminSchema");
const Employee = require("../model/employeeSchema");
const Lead = require("../model/leadSchema");
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



adminController.post('/LeadUpload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const Employer = req.body.Employer; // Get employer ID from the request body
    const workbook = xlsx.readFile(file.path);
    const sheet_name_list = workbook.SheetNames;
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    // Add employerId to each document
    const dataWithEmployer = jsonData.map(item => ({ ...item, Employer }));

    const savedData = await Lead.insertMany(dataWithEmployer);
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


adminController.get("/distributeDataToEmployees", async (req, res) => {
  try {
    const employees = await Employee.find({}, '_id').lean(); // Fetch employee documents with only _id field
    const data = await Admin.find({ IsCalled: false, AssignedTo: null }); // Find data with IsCalled status false and unassigned to any employee

    const totalEmployees = employees.length;
    const totalData = data.length;

    if (totalData === 0) {
      return sendResponse(res, 200, "Success", {
        success: true,
        message: "No data to distribute.",
        data: []
      });
    } 

    const dataPerEmployee = Math.floor(totalData / totalEmployees);
    let remainingData = totalData % totalEmployees;

    let dataIndex = 0;

    for (const employee of employees) {
      let dataCount = dataPerEmployee;
      if (remainingData > 0) {
        dataCount++; // Distribute the remaining data to the first few employees
        remainingData--;
      }

      const employeeId = employee._id;

      // Update the documents with the employee ID
      const distributedData = await Admin.updateMany({ 
        _id: { $in: data.slice(dataIndex, dataIndex + dataCount).map(item => item._id) } 
      }, { 
        AssignedTo: employeeId 
      });

      dataIndex += dataCount;
    }

    let distributedData = await Admin.find({ IsCalled: false });

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Data distributed to employees successfully!",
      data: distributedData,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.get("/assign-coldData-for-user/:id", async (req, res) => {
  try {
    let user = await Employee.findOne({_id:req.params.id})
    if(user.Department!='666e6eca32b92ee0216a56c5'){
      return  sendResponse(res, 200, "Success", {
          success: true,
          message: "Data Is Only For Sales Department!"
        });
      }
    const data = await Admin.find({AssignedTo:null})
    if(data.length==0){
    return  sendResponse(res, 200, "Success", {
        success: true,
        message: "No Data Left!"
      });
    }
    await Admin.updateOne({_id:data[0]._id},{AssignedTo:req.params.id},  { new: true })
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Data distributed to employees successfully!",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.get("/leadDistributeToEmployees", async (req, res) => { 
  try {
    const employees = await Employee.find({}, '_id').lean(); // Fetch employee documents with only _id field
    const data = await Lead.find({ IsCalled: false, AssignedTo: null, LeadFrom: { $exists: true } }); // Find data with IsCalled status false, unassigned to any employee, and LeadFrom exists

    const totalEmployees = employees.length;
    const totalData = data.length;

    if (totalData === 0) {
      return sendResponse(res, 200, "Success", {
        success: true,
        message: "No data to distribute.",
        data: []
      });
    }

    const dataPerEmployee = Math.floor(totalData / totalEmployees);
    let remainingData = totalData % totalEmployees;

    let dataIndex = 0;

    for (const employee of employees) {
      let dataCount = dataPerEmployee;
      if (remainingData > 0) {
        dataCount++; // Distribute the remaining data to the first few employees
        remainingData--;
      }

      const employeeId = employee._id;

      // Update the documents with the employee ID
      const distributedData = await Lead.updateMany({ 
        _id: { $in: data.slice(dataIndex, dataIndex + dataCount).map(item => item._id) } 
      }, { 
        AssignedTo: employeeId 
      });

      dataIndex += dataCount;
    }

    // Retrieve the distributed data that meets the LeadFrom condition
    let distributedData = await Lead.find({ IsCalled: false, LeadFrom: { $exists: true } });

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Data distributed to employees successfully!",
      data: distributedData,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.get("/employeeData/:employeeId", async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const currentPage = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.limit) || 10; // Default to 10 records per page if not provided

    // Calculate the number of documents to skip
    const skip = (currentPage - 1) * pageSize;

    console.log(`Fetching data for employeeId: ${employeeId}`);
    console.log(`Page: ${currentPage}, Limit: ${pageSize}, Skip: ${skip}`);

    // Query to retrieve distributed data for the employee with pagination
    const query = { AssignedTo: employeeId, IsCalled: false };

    // Retrieve the total count of records matching the query (for pagination info)
    const totalCount = await Admin.countDocuments(query);

    // Calculate totalPages early
    const totalPages = Math.ceil(totalCount / pageSize);

    // Fetch data with pagination
    const employeeData = await Admin.find(query)
      .skip(skip)
      .limit(pageSize);

    console.log(`Total count of documents: ${totalCount}`);
    console.log(`Data fetched for page ${currentPage}: ${employeeData.length} records`);
    console.log(`Fetched records:`, employeeData);

    // Respond with paginated data
    sendResponse(res, 200, "Success", {
      success: true,
      message: `Distributed data for employee ${employeeId} retrieved successfully!`,
      data: {
        totalCount, // Total number of matching records
        currentPage, // Current page number
        totalPages, // Total number of pages
        pageSize, // Number of records per page
        records: employeeData // Actual records for the current page
      },
    });
  } catch (error) {
    console.error(error);
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


adminController.post('/manualLeadDataUpload', async (req, res) => {
  try {

    const userData = { ...req.body }; // Add employee ID to user data
    const dataCreated = await adminServices.createLeadData(userData);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Manually Lead Data Uploaded Successfully!",
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
    const user = await Employee.findOne({_id:req.params.id})
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
    const currentPage = parseInt(req.query.currentPage) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 10;

    const callStatusData = await adminServices.getAllEmployeeCallStatus();
    
    // Retrieve only users whose department is Sales or has the specific department ID
    const salesDepartmentId = '666e6eca32b92ee0216a56c5';
    const users = await Employee.find({
      $or: [
        { Department: salesDepartmentId },
        { Department: 'Sales' }
      ]
    });

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
        },
        totalCalls: 0 // Initialize total calls count
      };

      // Loop through call status data to count status for each user
      for (const data of callStatusData) {
        // Check if data and user are defined and have the necessary properties
        if (data && data.CalledBy && user && user._id && data.CalledBy.toString() === user._id.toString()) {
          const status = data.CallStatus.length > 0 ? data.CallStatus[0] : null; // Check if CallStatus array is not empty
          if (status && obj.statusCounts.hasOwnProperty(status)) {
            obj.statusCounts[status]++;
            obj.totalCalls++; // Increment total calls count
          }
        }
      }
      userData.push(obj);
    }

    // Calculate total pages
    const totalUsers = userData.length;
    const totalPage = Math.ceil(totalUsers / pageSize);

    // Implement pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = currentPage * pageSize;
    const paginatedData = userData.slice(startIndex, endIndex);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Call status retrieved successfully",
      data: paginatedData,
      currentPage: currentPage,
      pageSize: pageSize,
      totalUsers: totalUsers,
      totalPage: totalPage  // Include totalPage in the response
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.get("/InterestedCallStatus", async (req, res) => {
  try {
    const { interestedCallsCount, interestedCallStatusData } = await adminServices.getInterestedCallStatus();
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Interested call status retrieved successfully",
      data: { interestedCallsCount, interestedCallStatusData }
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.get("/InterestedCustomer/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    // Retrieve interested call status data for the specified customer ID
    const interestedCallStatusData = await adminServices.getInterestedCustomer(_id);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Interested call status retrieved successfully",
      data: interestedCallStatusData
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.put("/editInterestedCustomer", async (req, res) => {
  try {
    const data = await adminServices.updateCustomer({ _id: req.body._id }, req.body);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Customer Data Updated successfully!",
      data: data
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.get("/LeadFromData", async (req, res) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10 if not provided

    // Fetch lead from data with pagination
    const { LeadFromData, LeadFromCount } = await adminServices.getLeadFromData(currentPage, pageSize);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Lead From data retrieved successfully!",
      data: {
        LeadFromData,
        LeadFromCount,
        currentPage,
        pageSize,
        totalPage: Math.ceil(LeadFromCount / pageSize)
      }
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.put("/LeadAdminDataUpdate", async (req, res) => {
  try {
    const data = await adminServices.LeadupdateData({ _id: req.body._id }, req.body);
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


adminController.get("/leadData/:employeeId", async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    // Retrieve the distributed data for the employee with the provided ID
    const employeeData = await Lead.find({ 
      AssignedTo: employeeId, 
      IsCalled: false, 
      LeadFrom: { $exists: true }
    });

    const employeeCount = employeeData.length;

    sendResponse(res, 200, "Success", {
      success: true,
      message: `Distributed data for employee ${employeeId} retrieved successfully!`,
      count: employeeCount,
      data: employeeData,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.put("/LeadMobileDataUpdate", async (req, res) => {
  try {
    const data = await adminServices.LeadupdateData({ _id: req.body._id }, req.body);
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


adminController.get("/followUpData/:employeeId", async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    // Retrieve the follow-up data for the employee with the provided ID
    const followUpData = await Admin.find({ 
      AssignedTo: employeeId, 
      CallStatus: 'FollowUp',
      SubStatus: { $exists: true, $ne: null },
      FollowUpDate: { $exists: true, $ne: null },
      FollowUpTime: { $exists: true, $ne: null }
    });

    const followUpCount = followUpData.length;

    sendResponse(res, 200, "Success", {
      success: true,
      message: `Follow-up data for employee ${employeeId} retrieved successfully!`,
      count: followUpCount,
      data: followUpData,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.get("/InterestedCustomerByEmp/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;

    // Retrieve interested customers for the specified employee ID
    const interestedCustomers = await adminServices.getInterestedCustomersByEmployee(employeeId);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Interested customers retrieved successfully",
      data: interestedCustomers
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.get("/pendingLeads", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const { pendingLeads, totalLeads } = await adminServices.getPendingLeads(pageNumber, limitNumber);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Pending leads retrieved successfully!",
      data: {
        pendingLeads,
        totalLeads,
        totalPages: Math.ceil(totalLeads / limitNumber),
        currentPage: pageNumber
      }
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.get("/AllMobileLeadFromData", async (req, res) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10 if not provided

    // Fetch lead from data with pagination
    const { LeadFromData, LeadFromCount } = await adminServices.getAllLeadFromData(currentPage, pageSize);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Lead From data retrieved successfully!",
      data: {
        LeadFromData,
        LeadFromCount,
        currentPage,
        pageSize,
        totalPage: Math.ceil(LeadFromCount / pageSize)
      }
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});



module.exports = adminController;