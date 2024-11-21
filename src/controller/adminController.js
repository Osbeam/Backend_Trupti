const express = require("express");
const adminController = express.Router();
const adminServices = require("../services/adminServices");
const Admin = require("../model/adminSchema");
const Employee = require("../model/employeeSchema");
const Lead = require("../model/leadSchema");
const LogUser = require("../model/loguserSchema")
const Archive = require("../model/archiveSchema")
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload")
const upload = require("../utils/excelUpload")
const { saveExcelDataToDB } = require('../services/adminServices'); 
const { processExcelFile } = require('../services/adminServices');
const fs = require('fs');
const xlsx = require('xlsx');
const multer = require('multer');
const auth = require('../utils/auth');




adminController.post('/upload', upload.single('file'), async (req, res) => {
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

    const savedData = await Admin.insertMany(deduplicatedData);
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


adminController.get("/getexcelfiles", auth, async (req, res) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 10;
    const data = await adminServices.getUnassignedFiles(currentPage, pageSize);
    const userCount = await Admin.countDocuments({ AssignedTo: { $exists: false }, CallStatus: { $size: 0 } });
    const totalPage = Math.ceil(userCount / pageSize);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Unassigned Excel files retrieved successfully!",
      data: data,
      userCount: userCount,
      totalPage: totalPage,
      currentPage: currentPage
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


Admin.collection.createIndex({ AssignedTo: 1 });

adminController.get("/assign-coldData-for-user/:id", async (req, res) => {
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
    const userHandledData = await Admin.find({
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
    const data = await Admin.find({ AssignedTo: null }).select('_id Name MobileNo1').limit(1).lean();
    console.log(`Fetch unassigned data: ${Date.now() - startTime}ms`);

    if (data.length === 0) {
      return sendResponse(res, 200, "Success", {
        success: true,
        message: "No data left!"
      });
    }

    // Assign the first unassigned data to the user
    const assignedData = await Admin.findByIdAndUpdate(
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


// adminController.get("/assign-coldData-for-user/:id", async (req, res) => {
//   const startTime = Date.now();

//   try {
//     const userId = req.params.id;

//     // Fetch the employee details with only necessary fields
//     const user = await Employee.findById(userId).select('Department').lean();
//     if (!user || user.Department !== '666e6eca32b92ee0216a56c5') {
//       return sendResponse(res, 200, "Success", {
//         success: true,
//         message: "Data is only for the Sales Department!" 

//       });
//     }
//     console.log(`Employee check: ${Date.now() - startTime}ms`);

//     // Check if there is user data with incomplete call status
//     const userHandledData = await Admin.find({
//       AssignedTo: userId,
//       CallStatus: { $in: [null, []] }
//     }).select('_id Name MobileNo1').lean();
//     console.log(`Incomplete call status check: ${Date.now() - startTime}ms`);

//     if (userHandledData.length > 0) {
//       return sendResponse(res, 200, "Success", {
//         success: true,
//         message: "Some of the user data call status is not updated",
//         data: userHandledData
//       });
//     }

//     // New sorting logic
//     const { sortField = 'DatabaseName', sortOrder = 'asc', limit = 1 } = req.query;

//     // Priority mapping for different database types (e.g., Doctors first)
//     const dataPriority = {
//       Doctors: 1,
//       Engineers: 2,
//       Others: 3,
//     };

//     // Fetch unassigned data based on sorting and prioritization
//     const data = await Admin.find({ AssignedTo: null })
//       .sort({
//         [sortField]: sortOrder === 'asc' ? 1 : -1,  // Sort by specified field and order
//         DatabaseName: (a, b) => (dataPriority[a.DatabaseName] || 999) - (dataPriority[b.DatabaseName] || 999)  // Prioritize certain data types
//       })
//       .limit(parseInt(limit))  // Limit the number of documents retrieved
//       .lean();
//     console.log(`Fetch unassigned data: ${Date.now() - startTime}ms`);

//     if (data.length === 0) {
//       return sendResponse(res, 200, "Success", {
//         success: true,
//         message: "No data left!"
//       });
//     }

//     // Assign the first unassigned data to the user
//     const assignedData = await Admin.findByIdAndUpdate(
//       data[0]._id,
//       { AssignedTo: userId },
//       { new: true, select: '_id Name MobileNo1' }
//     ).lean();
//     console.log(`Data assignment: ${Date.now() - startTime}ms`);

//     sendResponse(res, 200, "Success", {
//       success: true,
//       message: "Data distributed to employees successfully!",
//       data: assignedData,
//     });
//     console.log(`Total response time: ${Date.now() - startTime}ms`);

//   } catch (error) {
//     console.log(error);
//     sendResponse(res, 500, "Failed", {
//       message: error.message || "Internal server error",
//     });
//   }
// });


adminController.post('/manualDataUpload', auth,  async (req, res) => {
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


adminController.post('/manualLeadDataUpload', auth,  async (req, res) => {
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
    const data = await adminServices.updateData({ _id: req.body._id }, {...req.body, CallStatusUpdatedAt:new Date().toISOString()});
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


adminController.get("/Allcallstatus", auth,  async (req, res) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (currentPage - 1) * pageSize;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    // Fetch all distinct employees in the Admin collection
    const distinctEmployees = await Admin.distinct("AssignedTo");

    // Total number of employees
    const totalEmployees = distinctEmployees.length;

    // Calculate the total user count matching the criteria
    const totalUserCount = await Employee.countDocuments({
      _id: { $in: distinctEmployees },
      $or: [
        { Department: "666e6eca32b92ee0216a56c5" },
        { Department: "Sales" },
      ],
    });

    const totalPages = Math.ceil(totalEmployees / pageSize);

    // Get the list of employees for the current page
    const paginatedEmployees = distinctEmployees.slice(skip, skip + pageSize);

    let users = {};

    for (const AssignedTo of paginatedEmployees) {
      let currentUser = await Employee.findOne({
        _id: AssignedTo,
        $or: [
          { Department: "666e6eca32b92ee0216a56c5" },
          { Department: "Sales" },
        ],
      }).select("FirstName LastName EmployeeID _id");

      if (currentUser) {
        if (!users[AssignedTo]) {
          users[AssignedTo] = {
            user: currentUser,
            statusCounts: {
              CallNotReceived: 0,
              NotInterested: 0,
              Interested: 0,
              SwitchOff: 0,
              Connected: 0,
              Invalid: 0,
              NotConnected: 0,
              NotExists: 0,
              FollowUp: 0,
              totalCall: 0,
            },
          };
        }
        let formattedStartDate;
        let formattedEndDate;
        let callStatuses;
        if (req.query.showAllData) {
          callStatuses = await Admin.find({
            AssignedTo,
          });
        } else {
          if (!startDate && !endDate) {
            const today = new Date();
            formattedStartDate = new Date(today);
            formattedEndDate = new Date(today);
            formattedStartDate.setHours(0, 0, 0, 0);
            formattedEndDate.setHours(23, 59, 59, 999);
          } else {
            formattedStartDate = new Date(startDate);
            formattedEndDate = new Date(endDate);
            formattedStartDate.setHours(0, 0, 0, 0);
            formattedEndDate.setHours(23, 59, 59, 999);
          }
          callStatuses = await Admin.find({
            AssignedTo,
            CallStatusUpdatedAt: {
              $gte: new Date(formattedStartDate),
              $lte: new Date(formattedEndDate),
            },
          });
        }

        for (const callStatusRecord of callStatuses) {
          if (
            Array.isArray(callStatusRecord.CallStatus) &&
            callStatusRecord.CallStatus.length > 0
          ) {
            const CallStatus = callStatusRecord.CallStatus[0];
            if (users[AssignedTo].statusCounts[CallStatus] !== undefined) {
              users[AssignedTo].statusCounts[CallStatus]++;
              users[AssignedTo].statusCounts.totalCall++;
            }
          }
        }
      }
    }

    const result = Object.values(users);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Call status retrieved successfully",
      data: result,
      pagination: {
        currentPage,
        totalPages,
        pageSize,
      },
      totalUserCount, // Include the total user count in the response
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


adminController.get("/InterestedLeads/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    // Retrieve interested call status data for the specified customer ID
    const interestedCallStatusData = await adminServices.getInterestedLeads(_id);
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


adminController.get("/LeadFromData", auth,  async (req, res) => {
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
      // SubStatus: { $exists: true, $ne: null },
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

    // Create a response object
    let response = {
      success: true,
      message: "Lead From data retrieved successfully!",
      data: {
        LeadFromData,
        LeadFromCount,
        currentPage,
        pageSize,
        totalPage: Math.ceil(LeadFromCount / pageSize)
      }
    };

    // Check if the LeadFromData array is empty
    if (LeadFromData.length === 0) {
      response.data.LeadFromCount = 0;
      response.data.totalPage = 0;
      response.message = "No data left!";
    }

    // Emit an event to notify all connected clients
    req.io.emit('refreshData', response);

    // Send the response
    sendResponse(res, 200, "Success", response);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.get("/LeadAccepted/:employeeId", async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    // Retrieve the follow-up data for the employee with the provided ID
    const leadData = await Lead.find({ 
      AssignedTo: employeeId, 
      LeadCallStatus: 'Accept',
      $or: [
        { CallStatus: { $exists: false } },  
        { CallStatus: { $size: 0 } }         
      ]
    });

    const leadCount = leadData.length;

    sendResponse(res, 200, "Success", {
      success: true,
      message: `Accepted leads data for employee ${employeeId} retrieved successfully!`,
      count: leadCount,
      data: leadData,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.post('/archive-data', async (req, res) => {
  try {
    // Define the CallStatus values that should be moved
    const statusesToMove = ['SwitchOff', 'Invalid', 'NotExists', 'NotInterested', 'CallNotReceived', 'NotConnected'];

    // Find documents with the specified CallStatus values
    const dataToMove = await Admin.find({ CallStatus: { $in: statusesToMove } }).lean();

    if (dataToMove.length === 0) {
      sendResponse(res, 200, "Success", {
        success: true,
        message: 'No data to move',
      })
    }

    // Insert the documents into the new collection
    await Archive.insertMany(dataToMove);

    // Delete the documents from the original collection
    await Admin.deleteMany({ CallStatus: { $in: statusesToMove } });

    // res.status(200).send({ success: true, message: 'Data moved successfully' });
    sendResponse(res, 200, "Success", {
      success: true,
      message: 'Data moved successfully',
    })
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    })
  }
});


adminController.put("/assignBulkLeads", auth,  async (req, res) => {
  try {
    const { employeeId, leadIds, leadCallStatus } = req.body;

    if (!employeeId || !Array.isArray(leadIds) || leadIds.length === 0 || !leadCallStatus) {
      return sendResponse(res, 400, "Failed", {
        message: "employeeId, a non-empty array of leadIds, and leadCallStatus are required",
      });
    }

    // Update multiple lead documents with the new employeeId and LeadCallStatus
    const updateResult = await Lead.updateMany(
      { _id: { $in: leadIds } },
      { 
        $set: { 
          AssignedTo: employeeId,
          LeadCallStatus: leadCallStatus  // Update LeadCallStatus
        } 
      },
      { new: true }
    );

    console.log("Update Result:", updateResult);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Leads assigned successfully and LeadCallStatus updated!",
      data: updateResult
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


adminController.get("/allAssignedLeads", auth,  async (req, res) => {
  try {
    // Retrieve all leads data assigned to any employee
    const assignedLeads = await Lead.find({
      AssignedTo: { $exists: true, $ne: null },
      LeadCallStatus: 'Accept',
      LeadFrom: { $exists: true }}).populate('AssignedTo', 'FirstName LastName');

    const assignedLeadsCount = assignedLeads.length;

    sendResponse(res, 200, "Success", {
      success: true,
      message: "All assigned leads data retrieved successfully!",
      count: assignedLeadsCount,
      data: assignedLeads,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {        
      message: error.message || "Internal server error",
    });
  }
});


// adminController.delete('/remove-duplicates', async (req, res) => {
//   try {
//     // Find and group duplicates by MobileNo
//     const duplicates = await Admin.aggregate([
//       {
//         $group: {
//           _id: { MobileNo1: "$MobileNo1" }, 
//           uniqueIds: { $addToSet: "$_id" }, 
//           count: { $sum: 1 } 
//         }
//       },
//       {
//         $match: { count: { $gt: 1 } } // Filter groups with more than one document
//       }
//     ]);

//     if (duplicates.length === 0) {
//       sendResponse(res, 200, "Success", {
//         success: true,
//         message: 'No duplicates found',
//       });
//       return;
//     }
    
//     for (const doc of duplicates) {
//       const { uniqueIds } = doc;
//        uniqueIds.shift(); // Remove the first ID to keep one document
       
//        for(let i = 0; i<uniqueIds.length; i++){
//           const checkCallStatus = await Admin.findOne({_id:uniqueIds[i]._id})
//            if(checkCallStatus.CallStatus.length==0){
//              await Admin.deleteOne({_id:uniqueIds[i]._id});
//            console.log("to be deleted")
//             }
//             else{ console.log("to not be deleted")}
//        }
//     }

//     sendResponse(res, 200, "Success", {
//       success: true,
//       message: 'Duplicates removed successfully',
//     });
//   } catch (error) {
//     console.error('Error removing duplicates:', error);
//     sendResponse(res, 500, "Failed", {
//       message: error.message || "Internal server error",
//     });
//   }
// });



adminController.get('/leadCustomerList', async (req, res) => {
  try {
      const data = await Admin.aggregate([
          {
              '$match': {
                  'CallStatus': 'Interested'
              }
          },
          {
              '$project':{
                  '_id':1,
                  'Name':1
              }
          }
      ]);

      sendResponse(res, 200, "Success", {
          success: true,
          message: "Lead retrieved successfully!",
          data: data,
      })
  } catch (error) {
      console.log(error);
      sendResponse(res, 500, "Failed", {
          message: error.message || "Internal server error",
      });
  }
})


module.exports = adminController;