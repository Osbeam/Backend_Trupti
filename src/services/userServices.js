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



exports.getUser = async (query) => {
  return await Employee.find(query);
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
  const getEmployee = await Employee.find().skip(skip).limit(pageSize);
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