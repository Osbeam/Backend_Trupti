const express = require("express");
const propertyController = express.Router();
const Property = require("../model/propertySchema");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload")



propertyController.post('/propertyFormCreate', async (req, res) => {
    try {
      
        const userData = { ...req.body }; 
        const formCreated = await Property.create(userData);

        sendResponse(res, 200, "Success", {
            success: true,
            message: "Property form create successfully!",
            userData: formCreated
        });

    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});



module.exports = propertyController;