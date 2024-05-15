const express = require("express");
const departmentController = express.Router();
const departmentServices = require("../services/departmentServices");
const { sendResponse } = require("../utils/common");
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
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10 if not provided

        const data = await departmentServices.getAllDepartments(page, pageSize);
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



departmentController.get("/getSubDepartments", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10 if not provided

        const data = await departmentServices.getAllSubDepartments(page, pageSize);
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


module.exports = departmentController;