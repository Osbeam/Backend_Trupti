const express = require("express");
const userController = express.Router();
const userServices = require("../services/userServices");
const departmentServices = require("../services/departmentServices");
const LogUser = require("../model/loguserSchema");
const Department = require("../model/departmentSchema");
const SubDepartment = require("../model/subDepartmentSchema");
const Designation = require("../model/designationSchema");
const Admin = require("../model/adminSchema");
const EmployeeInfo = require("../model/employeeSchema");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload")
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone'); 
const auth = require('../utils/auth');




const setemployeeID = (number) => {
  let code = number.toString(); // Convert the number to a string
  while (code.length < 3) {
    code = '0' + code; // Prepend '0' until the string is at least 3 characters long
  }
  // console.log(number)
  return code;
};


// Function to generate a random employee ID consisting of only numbers
async function generateEmployeeID(departmentId, subDepartmentId, designationId)  {
  console.log("hello", departmentId)
  let employeeID = ''
  let employeeNumber = await EmployeeInfo.countDocuments({Department:departmentId, SubDepartment:subDepartmentId, Designation:designationId});
  let departmentCode = await Department.findOne({_id:departmentId})
  let subdepartmentCode = await SubDepartment.findOne({_id:subDepartmentId})
  let designationCode = await Designation.findOne({_id:designationId})
   employeeID = departmentCode.code+subdepartmentCode.code+designationCode.code+setemployeeID(++employeeNumber)
   return  employeeID;
}


const uploadimg = imgUpload.fields([
  { name: 'PanCard', maxCount: 1 },
  { name: 'AadharCard', maxCount: 1 },
  { name: 'Photo', maxCount: 1 },
  { name: 'AddressProof', maxCount: 1 },
  { name: 'HighestQuaCertificate', maxCount: 1 },
  { name: 'LastComRellievingLetter', maxCount: 1 },
  { name: 'BankDetails', maxCount: 1 }
]);


// userController.post('/employeeInfo', uploadimg, async (req, res) => {
//   try {
//     // Check if the email or mobile number already exists in the database
//     const existingEmployee = await EmployeeInfo.findOne({
//       $or: [{ EmailId: req.body.EmailId }, { MobileNumber: req.body.MobileNumber }]
//     });

//     if (existingEmployee) {
//       // If employee already exists with the same email or mobile number, send a response indicating the conflict
//       return res.status(409).send({
//         success: false,
//         message: "Email or mobile number already exists"
//       });
//     }

//     // Prepare employee data
//     const employeeData = { ...req.body };

//     // Generate Employee ID
//     const employeeID = await generateEmployeeID(req.body.Department, req.body.SubDepartment, req.body.Designation);
//     employeeData.EmployeeID = employeeID;
//     console.log(`Generated EmployeeID: ${employeeID} for employee: ${req.body.FirstName} ${req.body.LastName}`);
    

//     // Add the document paths to the employee data if files were uploaded
//     if (req.files) {
//       if (req.files.PanCard) employeeData.PanCard = req.files.PanCard[0].path;
//       if (req.files.AadharCard) employeeData.AadharCard = req.files.AadharCard[0].path;
//       if (req.files.Photo) employeeData.Photo = req.files.Photo[0].path;
//       if (req.files.AddressProof) employeeData.AddressProof = req.files.AddressProof[0].path;
//       if (req.files.HighestQuaCertificate) employeeData.HighestQuaCertificate = req.files.HighestQuaCertificate[0].path;
//       if (req.files.LastComRellievingLetter) employeeData.LastComRellievingLetter = req.files.LastComRellievingLetter[0].path;
//       if (req.files.BankDetails) employeeData.BankDetails = req.files.BankDetails[0].path;
//     }

//     // Create a new employee record
//     const employeeCreated = new EmployeeInfo(employeeData);
//     await employeeCreated.save();

//     sendResponse(res, 200, "Success", {
//       success: true,
//       message: "Employee Registered successfully!",
//       employeeData: employeeCreated
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// });



userController.post('/employeeInfo', uploadimg, async (req, res) => {
  try {
    // Check if the email or mobile number already exists in the database
    const existingEmployee = await EmployeeInfo.findOne({
      $or: [{ EmailId: req.body.EmailId }, { MobileNumber: req.body.MobileNumber }]
    });

    if (existingEmployee) {
      // If employee already exists with the same email or mobile number, send a response indicating the conflict
      return res.status(409).send({
        success: false,
        message: "Email or mobile number already exists"
      });
    }

    // Prepare employee data
    const employeeData = { ...req.body };

    // Generate Employee ID
    const employeeID = await generateEmployeeID(req.body.Department, req.body.SubDepartment, req.body.Designation);
    employeeData.EmployeeID = employeeID;
    console.log(`Generated EmployeeID: ${employeeID} for employee: ${req.body.FirstName} ${req.body.LastName}`);

    // Add the document paths to the employee data if files were uploaded
    if (req.files) {
      if (req.files.PanCard) employeeData.PanCard = req.files.PanCard[0].path;
      if (req.files.AadharCard) employeeData.AadharCard = req.files.AadharCard[0].path;
      if (req.files.Photo) employeeData.Photo = req.files.Photo[0].path;
      if (req.files.AddressProof) employeeData.AddressProof = req.files.AddressProof[0].path;
      if (req.files.HighestQuaCertificate) employeeData.HighestQuaCertificate = req.files.HighestQuaCertificate[0].path;
      if (req.files.LastComRellievingLetter) employeeData.LastComRellievingLetter = req.files.LastComRellievingLetter[0].path;
      if (req.files.BankDetails) employeeData.BankDetails = req.files.BankDetails[0].path;
    }

    // Create a new employee record
    const employeeCreated = new EmployeeInfo(employeeData);
    await employeeCreated.save();

    // Populate related fields (Department, SubDepartment, Designation, and ManagedBy)
    const populatedEmployee = await EmployeeInfo.findById(employeeCreated._id)
      .populate('Department', 'name')       // Assuming 'name' is the field in the Department model
      .populate('SubDepartment', 'name')    // Assuming 'name' is the field in the SubDepartment model
      .populate('Designation', 'name')      // Assuming 'name' is the field in the Designation model
      .populate('ManagedBy', 'FirstName LastName');       // Populating manager's name

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Employee Registered successfully!",
      employeeData: populatedEmployee
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});


userController.post("/EmployeeInfoLogin",  async (req, res) => {
  try {
    const { EmailId, Password } = req.body;
    const loggedUser = await userServices.EmployeeHrLogin({ EmailId, Password });

    if (!loggedUser) {
      return sendResponse(res, 401, "Unauthorized", {
        success: false,
        message: "Invalid Userdetails",
      });
    }

    // Debug log to check the retrieved user data
    console.log("Logged User:", loggedUser);

    // Check if the user has the role "Admin" or "HR"
    const validRoles = ["Admin", "HR"];
    if (!loggedUser.Role.some(role => validRoles.includes(role))) {
      return sendResponse(res, 403, "Forbidden", {
        success: false,
        message: "Access denied. Only Admin and HR can login.",
      });
    }

    const token = await jwt.sign({ loggedUser }, process.env.JWT_KEY);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Logged in successfully",
      token,
      loggedUser,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


userController.post("/AllEmployeeLogin", async (req, res) => {
  try {
    const { EmployeeID, Password } = req.body;
    const loggedUser = await userServices.EmployeeLogin({ EmployeeID, Password });

    if (!loggedUser) {
      return sendResponse(res, 401, "Unauthorized", {
        success: false,
        message: "Invalid Userdetails",
      });
    }
    console.log("Logged User:", loggedUser);

    const token = await jwt.sign({ loggedUser }, process.env.JWT_KEY);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Logged in successfully",
      token,
      loggedUser,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


userController.put("/updateEmployeeData", async (req, res) => {
  try {
    const data = await userServices.updateData({ _id: req.body._id }, req.body);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "User Updated successfully!",
      data: data
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


// userController.get("/getEmployee", auth, async (req, res) => {
//   try {
//     const currentPage = parseInt(req.query.currentPage) || 1; // Default to page 1 if not provided
//     const pageSize = parseInt(req.query.pageSize) || 10; 
//     const data = await userServices.getEmployee(currentPage, pageSize);
//     const userCount = await EmployeeInfo.countDocuments();
//     const totalPage = Math.ceil(userCount/10);
//     sendResponse(res, 200, "Success", {
//       success: true,
//       message: "All Employee list retrieved successfully!",
//       data: data, userCount, totalPage, currentPage
//     });
//   } catch (error) {
//     console.log(error);
//     sendResponse(res, 500, "Failed", {
//       message: error.message || "Internal server error",
//     });
//   }
// });



userController.get("/getEmployee", auth, async (req, res) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 10; 

    // Extract filters from query parameters
    const { name, role, employeeId, designation } = req.query;

    // Pass filters to the service function
    const data = await userServices.getEmployee(currentPage, pageSize, { name, role, employeeId, designation });

    sendResponse(res, 200, "Success", {
      success: true,
      message: "All Employee list retrieved successfully!",
      data: data.employees,
      userCount: data.userCount,
      totalPage: data.totalPage,
      currentPage: data.currentPage
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


userController.get("/getAllEmployee", auth, async (req, res) => {
  try {
    const data = await userServices.getAllEmployee();
    // const userCount = await EmployeeInfo.countDocuments();
    sendResponse(res, 200, "Success", {
      success: true,
      message: "All Employee list retrieved successfully!",
      data: data
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


userController.get("/getEmployeeNames", auth, async (req, res) => {
  try {
    const data = await userServices.getEmployeeName();
    sendResponse(res, 200, "Success", {
      success: true,
      message: "All Employee list retrieved successfully!",
      data: data
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


userController.get("/getEmployeebyId/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await userServices.getUser({ _id: userId });
    sendResponse(res, 200, "Success", {
      success: true,
      message: "User retrieved successfully!",
      data
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


userController.post("/inTime/:userId", imgUpload.array("inTimeImage", 10), async (req, res) => {
  try {
    // Process uploaded images and build the photoArray
    const photoArray = req.files.map((file) => file.path);

    const localTime = moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
    const currentTime = new Date();
    console.log("Local Time: ", localTime);

    // Create a new log entry in the database
    const userLogData = {
      userId: req.params.userId, // Retrieve userId from URL parameter
      inTimeImage: photoArray[0], // Assuming the first image is the source image
      // inTime: new Date(),
      inTime: localTime,
    };

    const logCreated = await LogUser.create(userLogData);

    // Fetch user data dynamically based on userId
    const userData = await EmployeeInfo.findById(req.params.userId); // Use the userId from URL parameter

    sendResponse(res, 200, "Success", {
      success: true,
      message: "User checkin successfully",
      user: logCreated
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      success: false,
      message: error.message || "Internal server error"
    });
  }
});


userController.put("/editInTime/:logId", auth, imgUpload.array("inTimeImage", 10), async (req, res) => {
  try {
    const logId = req.params.logId;
    const { inTime, outTime } = req.body;

    // Find the log entry in the database based on logId
    const existingLog = await LogUser.findById(logId);

    if (!existingLog) {
      return sendResponse(res, 404, "Not Found", {
        success: false,
        message: "Log entry not found"
      });
    }

    // Update log data with new inTime and outTime
    existingLog.inTime = String(inTime);
    existingLog.outTime = String(outTime);

    // Parse the times into Moment objects
    const checkInMoment = moment(inTime);
    const checkOutMoment = moment(outTime);

    // Calculate the difference in time
    const totalHours = moment.duration(checkOutMoment.diff(checkInMoment));

    // Format totalHours
    const hours = Math.floor(totalHours.asHours());
    const minutes = Math.floor(totalHours.asMinutes()) % 60;
    const formattedTotalHours = `${hours}hr ${minutes}min`;

    // Add formatted total hours to log data
    existingLog.totalHours = formattedTotalHours;

    await existingLog.save();

    sendResponse(res, 200, "Success", {
      success: true,
      message: "In-time document updated successfully",
      log: existingLog,
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      success: false,
      message: error.message || "Internal server error"
    });
  }
});


userController.put("/outTime", async (req, res) => {
  try {
    // Retrieve inTime from the database
    const inTimeData = await userServices.getInTimeById({ _id: req.body.logId });
    const inTime = inTimeData.inTime;

    const localTime = moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
    const currentTime = new Date();
    console.log("Local Time: ", localTime);


    const userLogData = {
      outTime: localTime,
      totalHours: req.body.totalHours
    };

    // Update user log data in the database
    const outTimeCreated = await userServices.logUserUpdate(req.body.logId, userLogData);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Out Time created successfully",
      logData: outTimeCreated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json
    ({ error: "Failed", message: error.message || "Internal server error" });
  }
});


userController.get("/getLogUserbyid", async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    const query = { userId };

    if (startDate) {
      query.inTime = { $gte: new Date(startDate).toISOString() };
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.inTime = { ...query.inTime, $lte: endOfDay.toISOString() };
    }

    const data = await userServices.getLogUser(query);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Users Log list retrieved successfully!",
      data: data
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


userController.get("/getApprovedLogUsers", auth, async (req, res) => {
  try {
    const { approved, startDate, endDate, currentPage, pageSize } = req.query;
    const query = { approved: approved === 'true' }; // Convert approved to boolean

    // Apply date filters if provided
    if (startDate) {
      query.inTime = { $gte: new Date(startDate).toISOString() };
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.inTime = { ...query.inTime, $lte: endOfDay.toISOString() };
    }

    // Convert query strings to numbers
    const page = parseInt(currentPage) || 1;
    const size = parseInt(pageSize) || 10;

    // Calculate skip value for pagination
    const skip = (page - 1) * size;

    // Retrieve aggregated data from the service
    const data = await userServices.getApprovedLogUsers(query, skip, size);

    // Get total count of unique users for pagination
    const totalCountPipeline = [
      { $match: query },
      {
        $group: {
          _id: "$userId"
        }
      },
      { $count: "totalUsers" }
    ];

    const totalCountResult = await LogUser.aggregate(totalCountPipeline).exec();
    const totalCount = totalCountResult[0] ? totalCountResult[0].totalUsers : 0;

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / size);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Users Approved Log list retrieved successfully!",
      data: data,
      currentPage: page,
      pageSize: size,
      totalPages: totalPages,
      totalDocuments: totalCount
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


userController.get("/getLogUsers", auth,   async (req, res) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1; 
    const pageSize = parseInt(req.query.pageSize) || 10; 
    const data = await userServices.getAllLogUser(currentPage, pageSize);
    const userCount = await LogUser.countDocuments({ approved: false });
    const totalPage = Math.ceil(userCount/10);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "All Users Log list retrieved successfully!",
      data : data, userCount, totalPage, currentPage
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


userController.delete("/deleteLog/:logId", auth,  async (req, res) => {
  try {
    const logId = req.params.logId;

    // Find the log entry in the database based on logId
    const logToDelete = await LogUser.findById(logId);


    if (!logToDelete) {
      return sendResponse(res, 404, "Not Found", {
        success: false,
        message: "Log entry not found"
      });
    }

    // Delete the log entry
    await logToDelete.deleteOne();

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Log entry deleted successfully"
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      success: false,
      message: error.message || "Internal server error"
    });
  }
});


userController.put("/editLogUser/:logId", auth, async (req, res) => {
  try {
    const logId = req.params.logId;
    const updates = req.body;

    // Find the log entry in the database based on logId
    const existingLog = await LogUser.findById(logId);

    if (!existingLog) {
      return sendResponse(res, 404, "Not Found", {
        success: false,
        message: "Log entry not found"
      });
    }

    // Update log data with new field values
    Object.assign(existingLog, updates);
    existingLog.updatedAt = new Date(); // Update updatedAt timestamp

    await existingLog.save();

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Log entry updated successfully",
      log: existingLog
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      success: false,
      message: error.message || "Internal server error"
    });
  }
});


userController.get("/getTeamLeaders", auth, async (req, res) => {
  try {
    // Fetch team leaders, bosses, and managers
    const roles = ["TeamLeader", "Boss", "Manager"];
    const data = await EmployeeInfo.find({ Position: { $in: roles } });

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Team Leaders, Bosses, and Managers list retrieved successfully!",
      data: data,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


userController.get("/getFollowers/:leaderId", auth, async (req, res) => {
  try {
    const data = await EmployeeInfo.find({ ManagedBy: req.params.leaderId });
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Followers list retrieved successfully!",
      data: data,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


userController.get('/generateSalarySlip/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const employee = await EmployeeInfo.findOne({ _id: userId });
    if (!employee) {
      return res.status(404).send({
        success: false,
        message: "Employee not found",
      });
    }

    // Calculate total income and deductions
    const totalIncome = parseFloat(employee.BasicSalary || 0) +
      parseFloat(employee.FixedAllowance || 0) +
      parseFloat(employee.MedicalAllowance || 0) +
      parseFloat(employee.Reimbursment || 0) +
      parseFloat(employee.SpecialAllowance || 0) +
      parseFloat(employee.VeriableAllowance || 0);

    const totalDeductions = parseFloat(employee.PF || 0) +
      parseFloat(employee.PT || 0); 

    
    const netSalary = totalIncome - totalDeductions;

  
    const salarySlip = {
      EmployeeName: `${employee.FirstName} ${employee.LastName}`,
      EmployeeCode: employee.EmployeeID,
      Designation: employee.Designation,
      DateOfJoining: employee.DateOfJoining,
      BankName: employee.BankName,
      AccountNumber: employee.AccountNumber,
      UANNumber: employee.UANNumber,
      PANNumber: employee.PanNumber,
      TotalIncome: totalIncome.toFixed(2),
      TotalDeductions: totalDeductions.toFixed(2),
      NetSalary: netSalary.toFixed(2),
      IncomeBreakdown: {
        BasicSalary: employee.BasicSalary,
        FixedAllowance: employee.FixedAllowance,
        MedicalAllowance: employee.MedicalAllowance,
        Reimbursment: employee.Reimbursment,
        SpecialAllowance: employee.SpecialAllowance,
        VeriableAllowance: employee.VeriableAllowance,
      },
      DeductionBreakdown: {
        PF: employee.PF,
        PT: employee.PT,
      },
    };

    sendResponse(res, 200, "Salary Slip Generated", {
      success: true,
      message: "Salary slip generated successfully",
      salarySlip: salarySlip,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});


userController.get("/getLeaderEmployeeData", auth, async (req, res) => {
  try {
    // Fetch all team leaders
    const teamLeaders = await EmployeeInfo.find({ Position: "TeamLeader" }).lean().select("EmployeeID FirstName LastName Position");;

    // Add managed employees and their call details for each team leader
    await Promise.all(
      teamLeaders.map(async (leader) => {
        const managedEmployees = await EmployeeInfo.find({ ManagedBy: leader._id }).lean().select("EmployeeID FirstName LastName Position");

        // Add call details for each employee
        await Promise.all(
          managedEmployees.map(async (employee) => {
            const callDetails = await Admin.find({ AssignedTo: employee._id }).lean();

            // Initialize status counts
            const statusCounts = {
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
            };

            // Aggregate call statuses
            callDetails.forEach((call) => {
              call.CallStatus.forEach((status) => {
                if (statusCounts[status] !== undefined) {
                  statusCounts[status]++;
                }
              });
              statusCounts.totalCall++;
            });

            // Attach statusCounts to the employee
            employee.callDetails = statusCounts;
          })
        );

        // Attach managed employees to the leader
        leader.managedEmployees = managedEmployees;
      })
    );

    // Send response
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Leaders and their employee data retrieved successfully!",
      data: teamLeaders,
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      success: false,
      message: error.message || "Internal server error",
    });
  }
});


userController.get("/getDepartmentDetails", async (req, res) => {
    try {

        const data = await userServices.getAllDepartments();
        sendResponse(res, 200, "Success", {
            success: true,
            message: "All Department list retrieved successfully!",
            data: data
        });
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});




module.exports = userController;