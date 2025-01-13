const express = require("express");
const propertyController = express.Router();
const Property = require("../model/propertySchema");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload")




const uploadFields = [
    { name: "SaleDeed", maxCount: 5 }, // Allow up to 5 property photos
    { name: "ChainAgreement", maxCount: 3 }, // Allow up to 3 ownership documents
    { name: "MutationOrExtract7_12", maxCount: 5 }, // Allow 1 ID proof
    { name: "Parcha", maxCount: 5 }, // Allow 1 ID proof
    { name: "Khajana_PropertyTax", maxCount: 5 }, // Allow 1 ID proof
    { name: "SanctionPlan", maxCount: 5 }, // Allow 1 ID proof
    { name: "ElectricityBill", maxCount: 5 }, // Allow 1 ID proof
    { name: "Quotation", maxCount: 5 }, // Allow 1 ID proof
    { name: "DraftAgreement", maxCount: 5 }, // Allow 1 ID proof
];



propertyController.post('/propertyFormCreate', imgUpload.fields(uploadFields), async (req, res) => {
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

        const formCreated = await Property.create(newData);

        sendResponse(res, 200, "Success", {
            success: true,
            message: "Property form created successfully!",
            data: formCreated,
        });

    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});



module.exports = propertyController;