const express = require("express");
const formController = express.Router();
const formServices = require("../services/formServices");
const User = require("../model/employeeSchema");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload")



formController.post('/eligibilityForm', async (req, res) => {
    try {
        // Check if the email or mobile number already exists in the database
        const existingUser = await User.findOne({
            $or: [{ Email: req.body.Email }, { MobileNumber: req.body.MobileNumber }]
        });
        const userData = { ...req.body }; // Add employee ID to user data
        const formCreated = await formServices.createForm(userData);

        sendResponse(res, 200, "Success", {
            success: true,
            message: "Eligibility form create successfully!",
            userData: formCreated
        });

    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});


formController.get("/getEligibilityForms", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10 if not provided

        const data = await formServices.getEligibilityForm(page, pageSize);
        sendResponse(res, 200, "Success", {
            success: true,
            message: "All EligibilityForm list retrieved successfully!",
            data: data
        });
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});


formController.post('/incomeEntryForm', async (req, res) => {
    try {
        const { NetSalary, CoApplicantNetSalary } = req.body;

        // Check if NetSalary is not provided or is not a number
        if (!NetSalary || isNaN(parseFloat(NetSalary))) {
            return sendResponse(res, 400, "Failed", {
                success: false,
                message: "NetSalary must be provided and must be a number"
            });
        }

        // Check if CoApplicantNetSalary is not provided or is not a number
        if (!CoApplicantNetSalary || isNaN(parseFloat(CoApplicantNetSalary))) {
            return sendResponse(res, 400, "Failed", {
                success: false,
                message: "CoApplicantNetSalary must be provided and must be a number"
            });
        }

        // Check if NetSalary is above 1 lakh
        if (parseFloat(NetSalary) < 100000) {
            return sendResponse(res, 400, "Failed", {
                success: false,
                message: "NetSalary must be above 1 lakh to create the form"
            });
        }

        // Check if CoApplicantNetSalary is above 1 lakh
        if (parseFloat(CoApplicantNetSalary) < 100000) {
            return sendResponse(res, 400, "Failed", {
                success: false,
                message: "CoApplicantNetSalary must be above 1 lakh to create the form"
            });
        }

        const userData = { ...req.body };
        const formCreated = await formServices.createIncomeForm(userData);

        sendResponse(res, 200, "Success", {
            success: true,
            message: "Eligibility form created successfully!",
            userData: formCreated,
        });

    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});


formController.get("/getIncomeEntryForms", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10 if not provided

        const data = await formServices.getIncomeForm(page, pageSize);
        sendResponse(res, 200, "Success", {
            success: true,
            message: "All EligibilityForm list retrieved successfully!",
            data: data
        });
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});



module.exports = formController;