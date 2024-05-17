const mongoose = require("mongoose");
const User = require("../model/userSchema");
const LogUser = require("../model/loguserSchema");
const { body } = require("express-validator");

exports.create = async (body) => {
  return await User.create(body);
};


exports.login = async (body) => {
  return await User.findOne(body);
};



exports.getAllUsers = async (currentPage, pageSize) => {
  const skip = (currentPage - 1) * pageSize;
  const users = await User.find().skip(skip).limit(pageSize);
  return users;
};



exports.getUser = async (query) => {
  return await User.find(query);
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
  const logUsers = await LogUser.find().populate('userId', 'UserName EmployeeID').skip(skip).limit(pageSize);
  return logUsers;
};




exports.getApprovedLogUsers = async (query, skip, limit) => {
  // Retrieve all users with their logs
  const users = await LogUser.find(query).populate('userId')
  .skip(skip)
  .limit(limit);

  // Initialize an object to store user IDs and their corresponding counts of approved logs
  const approvedCounts = {}; 

  // Iterate through the users to count the number of approved logs for each user
  users.forEach(user => {
    if (user.userId && user.userId._id) { // Check if userId and _id exist
      const userId = user.userId._id.toString(); // Convert userId to string for consistency
      if (user.approved) {
        if (!approvedCounts[userId]) {
          approvedCounts[userId] = 1;
        } else {
          approvedCounts[userId]++;
        }
      }
    }
  });

  // Combine the count of approved logs with the user data
  const userDataWithCount = users.map(user => ({
    userId: user.userId ? user.userId._id : null, // Check if userId exists before accessing _id
    username: user.userId ? user.userId.username : null, // Check if userId exists before accessing username
    count: approvedCounts[user.userId ? user.userId._id.toString() : null] || 0,
    logs: user
  }));

  return userDataWithCount;
};

