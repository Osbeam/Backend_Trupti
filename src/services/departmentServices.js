const mongoose = require("mongoose");
const Department = require("../model/departmentSchema");
const SubDepartment = require("../model/subDepartmentSchema");
const Designation = require("../model/designationSchema");
const { body } = require("express-validator");

exports.create = async (body) => {
    return await Department.create(body);
};


exports.getAllDepartments = async () => {
    const department = await Department.find().populate({path: 'SubDepartment'});
    return department;
};



exports.createSubDepartments = async (body) => {
    return await SubDepartment.create(body);
};



exports.getAllSubDepartments = async (id) => {
    const Subdepartment = await SubDepartment.findOne({_id:id}).populate({path: 'designation'});
    return Subdepartment;
};




exports.createDesignation = async (body) => {
    return await Designation.create(body);
};