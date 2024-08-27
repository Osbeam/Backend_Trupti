const mongoose = require("mongoose");
const LeaveManagement = require("../model/leaveManagementSchema");
const { body } = require("express-validator");



exports.createLeave = async (body) => {
    return await LeaveManagement.create(body);
};