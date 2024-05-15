const mongoose = require("mongoose");
const Department = require("../model/departmentSchema");
const SubDepartment = require("../model/subDepartmentSchema");
const { body } = require("express-validator");

exports.create = async (body) => {
    return await Department.create(body);
};


exports.getAllDepartments = async (page, pageSize) => {
    const skip = (page - 1) * pageSize;
    const department = await Department.find().skip(skip).limit(pageSize);
    return department;
};



exports.createSubDepartments = async (body) => {
    return await SubDepartment.create(body);
};



exports.getAllSubDepartments = async (page, pageSize) => {
    const skip = (page - 1) * pageSize;
    const Subdepartment = await SubDepartment.find().skip(skip).limit(pageSize);
    return Subdepartment;
};