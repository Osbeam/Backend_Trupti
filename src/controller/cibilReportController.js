const express = require("express");
const cibilReportController = express.Router();
const CibilReport = require("../model/cibilReportSchema");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload")




const uploadFields = [
    { name: "CibilReport", maxCount: 5 }, // Allow up to 5 property photos
    { name: "LoanStatemen", maxCount: 3 }, // Allow up to 3 ownership documents
    { name: "ListOfDocuments", maxCount: 5 }, // Allow 1 ID proof
    { name: "SanctionLette", maxCount: 5 }, // Allow 1 ID proof
    { name: "ForeclosureLetter", maxCount: 5 }, // Allow 1 ID proof
    { name: "NOC", maxCount: 5 }, // Allow 1 ID proof
];



cibilReportController.post('/Create', imgUpload.fields(uploadFields), async (req, res) => {
    try {
        const additionalData = req.body;
        const files = req.files;
        let newData = { ...additionalData };

        if (files) {
            // Map the uploaded files to the respective fields
            Object.keys(files).forEach((key) => {
                if (files[key] && files[key].length > 0) {
                    // Store multiple files as an array of paths for the respective field
                    newData[key] = files[key].map(file => file.path);
                }
            });
        }

        const cibilCreated = await CibilReport.create(newData);

        sendResponse(res, 200, "Success", {
            success: true,
            message: "Cibil Report created successfully!",
            data: cibilCreated,
        });

    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});



module.exports = cibilReportController;