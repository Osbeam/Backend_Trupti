const mongoose = require("mongoose");
const LogUser = require("../model/loguserSchema");
const Employee = require("../model/employeeSchema");
const Department = require("../model/departmentSchema");
const { body } = require("express-validator");




exports.getAllUsers = async (currentPage, pageSize) => {
  const skip = (currentPage - 1) * pageSize;
  const users = await Employee.find().skip(skip).limit(pageSize);
  return users;
};




exports.getUser = async (query) => {
  try {
    const employees = await Employee.find(query)
      .populate('Department', 'name') 
      .populate('SubDepartment', 'name') 
      .populate('Designation', 'name'); 
    
    const formattedEmployees = employees.map(employee => ({
      _id: employee._id,
      MrMissMrs: employee.MrMissMrs,
      FirstName: employee.FirstName,
      MiddleName: employee.MiddleName,
      LastName: employee.LastName,
      MobileNumber: employee.MobileNumber,
      Password: employee.Password,
      EmailId: employee.EmailId,
      EmployeeID: employee.EmployeeID,
      Department: employee.Department ? employee.Department.name : null, 
      SubDepartment: employee.SubDepartment ? employee.SubDepartment.name : null, 
      Designation: employee.Designation ? employee.Designation.name : null, 
      BloodGroup: employee.BloodGroup,
      CurrentAddress: employee.CurrentAddress,
      PermanentAddress: employee.PermanentAddress,
      HighestQualification: employee.HighestQualification,
      Year: employee.Year,
      TotalExperience: employee.TotalExperience,
      LastCompanyName: employee.LastCompanyName,
      JoiningDate: employee.JoiningDate,
      Reference1: employee.Reference1,
      Relation1: employee.Relation1,
      Address1: employee.Address1,
      ReferenceName2: employee.ReferenceName2,
      Relation2: employee.Relation2,
      Address2: employee.Address2,
      ReportingTo: employee.ReportingTo,
      ManagerName: employee.ManagerName,
      DateOfJoining: employee.DateOfJoining,
      CompanyName: employee.CompanyName,
      BasicSalary: employee.BasicSalary,
      FixedAllowance: employee.FixedAllowance,
      SpecialAllowance: employee.SpecialAllowance,
      VeriableAllowance: employee.VeriableAllowance,
      Deductions: employee.Deductions,
      NoteBook: employee.NoteBook,
      Stationery: employee.Stationery,
      JoiningKit: employee.JoiningKit,
      OfficialMobileNumber: employee.OfficialMobileNumber,
      MobileIMEINumber: employee.MobileIMEINumber,
      PanCard: employee.PanCard,
      AadharCard: employee.AadharCard,
      Photo: employee.Photo,
      AddressProof: employee.AddressProof,
      HighestQuaCertificate: employee.HighestQuaCertificate,
      LastComRellievingLetter: employee.LastComRellievingLetter,
      BankDetails: employee.BankDetails,
      BankName: employee.BankName,
      AccountHolderName: employee.AccountHolderName,
      AccountNumber: employee.AccountNumber,
      IFSCCode: employee.IFSCCode,
      Role: employee.Role,
      Position: employee.Position,
      ManagedBy: employee.ManagedBy,
      updatedAt: employee.updatedAt,
      createdAt: employee.createdAt,
      __v: employee.__v
    }));

    return formattedEmployees;
  } catch (error) {
    throw error; // Throw the error to be handled elsewhere
  }
};








exports.logUserUpdate = async (id, update) => {
  return await LogUser.findByIdAndUpdate(id, update, { new: true });
};


exports.getInTimeById = async (filter) => {
  try {
    const logUser = await LogUser.findOne(filter);

    if (!logUser) {
      throw new Error("LogUser not found");
    }

    const inTime = logUser.inTime;
    return { inTime };
  } catch (error) {
    throw new Error(`Error in getInTimeById: ${error.message}`);
  }
};


exports.getLogUser = async (query) => {
  return await LogUser.find(query);
};


exports.getAllLogUser = async (currentPage, pageSize) => {
  const skip = (currentPage - 1) * pageSize;
  const logUsers = await LogUser.find({ approved: false })
  .populate('userId', 'FirstName EmployeeID')
  .sort({ createdAt: -1 })
  .skip(skip).limit(pageSize);
  return logUsers;
};




exports.getApprovedLogUsers = async (query, skip, limit) => {
  console.log("Service Query:", query);
  console.log("Service Skip:", skip, "Limit:", limit);

  const aggregatePipeline = [
    { $match: query },
    {
      $group: {
        _id: "$userId",
        count: { $sum: 1 },
        userId: { $first: "$userId" } // This retains the userId for later population
      }
    },
    { $sort: { count: -1 } }, // Optional: sort by count of logs in descending order
    { $skip: skip },
    { $limit: limit }
  ];

  console.log("Aggregate Pipeline:", JSON.stringify(aggregatePipeline, null, 2));

  // Run the aggregation pipeline
  const logUserCounts = await LogUser.aggregate(aggregatePipeline).exec();

  console.log("Log User Counts:", logUserCounts);

  // Populate the userId with user details
  const populatedResults = await LogUser.populate(logUserCounts, {
    path: 'userId',
    select: 'EmployeeID FirstName Designation' // Ensure fields match your schema
  });

  console.log("Populated Results:", populatedResults);

  const userDataWithCount = populatedResults.map(log => {
    if (!log.userId || !log.userId._id) {
      // Handle cases where userId or _id is null or undefined
      return {
        userId: null,
        EmployeeID: null,
        FirstName: null,
        Designation: null,
        count: log.count,
      };
    }
    return {
      userId: log.userId._id,
      EmployeeID: log.userId.EmployeeID,
      FirstName: log.userId.FirstName,
      Designation: log.userId.Designation,
      count: log.count
    };
  });

  console.log("User Data with Count:", userDataWithCount);

  // Return userDataWithCount
  return userDataWithCount;
};




exports.updateData = async (filter, update)=> {
  return await Employee.updateOne(filter, update, { new: true });
};





exports.getEmployee = async (currentPage = 1, pageSize = 10) => {
  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = 1;
  }
  if (isNaN(pageSize) || pageSize < 1) {
    pageSize = 10;
  }
  const skip = (currentPage - 1) * pageSize;

  try {
    // Fetch employees with pagination
    const employees = await Employee.find()
      .skip(skip)
      .limit(pageSize)
      .populate('Department', 'name')
      .populate('SubDepartment', 'name')
      .populate('Designation', 'name')
      .lean();

    // Extract non-null ManagedBy IDs
    const employeeIds = employees.map(emp => emp.ManagedBy).filter(id => id && id !== 'null');

    // Fetch managers
    const managers = await Employee.find({
      _id: { $in: employeeIds }
    }).select('FirstName LastName');

    // Create a map of manager IDs to manager details
    const managerMap = managers.reduce((acc, manager) => {
      acc[manager._id] = manager;
      return acc;
    }, {});

    // Map employees with their manager details
    const result = employees.map(emp => ({
      ...emp,
      ManagedBy: managerMap[emp.ManagedBy] || null
    }));

    // Get the total count of employees for pagination
    const userCount = await Employee.countDocuments();
    const totalPage = Math.ceil(userCount / pageSize);

    // Format and return the result
    return {
      employees: result,
      userCount,
      totalPage,
      currentPage
    };
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw new Error("Unable to fetch employees. Please try again later.");
  }
};


exports.getEmployeeName = async (query) => {
  return await Employee.find(query, 'FirstName MiddleName LastName _id');
};



exports.EmployeeLogin = async ({ EmployeeID, Password }) => {
  const user = await Employee.findOne({ EmployeeID });
  if (user && user.Password === Password) {
    return user;
  }
  return null;
};



exports.EmployeeHrLogin = async ({ EmailId, Password }) => {
  const user = await Employee.findOne({ EmailId });
  if (user && user.Password === Password) {
    return user;
  }
  return null;
};