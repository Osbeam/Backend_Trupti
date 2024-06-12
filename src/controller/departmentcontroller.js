const express = require("express");
const departmentController = express.Router();
const departmentServices = require("../services/departmentServices");
const { sendResponse } = require("../utils/common");
const SubDepartment = require("../model/subDepartmentSchema");
const Department = require("../model/departmentSchema");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });




departmentController.post('/createDepartments', async (req, res) => {
    try {
        const depData = { ...req.body };
        const depCreated = await departmentServices.create(depData);

        sendResponse(res, 200, "Success", {
            success: true,
            message: "Department create successfully!",
            depData: depCreated
        });

    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});


departmentController.get("/getDepartments", async (req, res) => {
    try {

        const data = await departmentServices.getAllDepartments();
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



departmentController.post('/createSubDepartments', async (req, res) => {
    try {
        const subDepData = { ...req.body };
        const SubdepCreated = await departmentServices.createSubDepartments(subDepData);
        const query = {$push:{SubDepartment:SubdepCreated._id}}
        await Department.findOneAndUpdate({_id:req.body.department}, query, {new:true} )
        sendResponse(res, 200, "Success", {
            success: true,
            message: "SubDepartments create successfully!",
            depData: SubdepCreated
        });

    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});



departmentController.get("/getSubDepartments/:id", async (req, res) => {
    try {

        const data = await departmentServices.getAllSubDepartments(req.params.id);
        sendResponse(res, 200, "Success", {
            success: true,
            message: "All SubDepartment list retrieved successfully!",
            data: data
        });
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});



departmentController.post('/createDesignation', async (req, res) => {
    try {
       
        const DesignationCreated = await departmentServices.createDesignation(req.body);
        const query = {$push:{designation:DesignationCreated._id}}
        await SubDepartment.findOneAndUpdate({_id:req.body.subDepartment}, query, {new:true} )
        sendResponse(res, 200, "Success", {
            success: true,
            message: "Designation create successfully!",
            designationData: DesignationCreated
        });

    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});


departmentController.get("/getDesignation", async (req, res) => {
    try {

        const data = await departmentServices.getAllDesignation();
        sendResponse(res, 200, "Success", {
            success: true,
            message: "All Designation list retrieved successfully!",
            data: data
        });
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});


module.exports = departmentController;