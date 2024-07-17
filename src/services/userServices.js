const mongoose = require("mongoose");
const User = require("../model/userSchema");
const LogUser = require("../model/loguserSchema");
const Employee = require("../model/employeeSchema");
const { body } = require("express-validator");

exports.create = async (body) => {
  return await User.create(body);
};


exports.login = async (body) => {
  return await User.findOne(body);
};



exports.getAllUsers = async (currentPage, pageSize) => {
  const skip = (currentPage - 1) * pageSize;
  const users = await Employee.find().skip(skip).limit(pageSize);
  return users;
};



// exports.getUser = async (query) => {
//   return await Employee.find(query);
// };




exports.getUser = async (query) => {
  try {
    const employees = await Employee.find(query)
      .populate('Department', 'name') // Populate department and select 'name' field
      .populate('SubDepartment', 'name') // Populate subdepartment and select 'name' field
      .populate('Designation', 'name'); // Populate designation and select 'name' field

    // Map over each employee to structure the response as needed
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
      Department: employee.Department ? employee.Department.name : null, // Access 'name' if populated
      SubDepartment: employee.SubDepartment ? employee.SubDepartment.name : null, // Access 'name' if populated
      Designation: employee.Designation ? employee.Designation.name : null, // Access 'name' if populated
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
  const logUsers = await LogUser.find({ approved: false }).populate('userId', 'FirstName EmployeeID').skip(skip).limit(pageSize);
  return logUsers;
};




exports.getApprovedLogUsers = async (query, skip, limit) => {
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

  // Run the aggregation pipeline
  const logUserCounts = await LogUser.aggregate(aggregatePipeline).exec();

  // Populate the userId with user details
  const populatedResults = await LogUser.populate(logUserCounts, {
    path: 'userId',
    select: 'EmployeeID FirstName Designation' // Ensure fields match your schema
  });

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

  // Return userDataWithCount
  return userDataWithCount;
};

  






exports.updateData = async (filter, update)=> {
  return await Employee.updateOne(filter, update, { new: true });
};



exports.getEmployee = async(currentPage, pageSize)=> {
  const skip = (currentPage - 1) * pageSize;
  const getEmployee = await Employee.find().skip(skip).limit(pageSize).populate('ManagedBy', 'FirstName LastName');
  return getEmployee;
}



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