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


exports.logUserUpdate = async (id, update) => {
  return await LogUser.findByIdAndUpdate(id, update, { new: true });
};


exports.getInTimeById = async (filter) => {
  try {
    const logUser = await LogUser.findOne(filter);

    if (!logUser) {
      throw new Error("LogUser not found");
    }

    // Adjust the property name based on your LogUser schema
    const inTime = logUser.inTime;

    return { inTime };
  } catch (error) {
    throw new Error(`Error in getInTimeById: ${error.message}`);
  }
};