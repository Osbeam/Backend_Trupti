const express = require("express");
const branchController = express.Router();
const Branch = require("../model/branchSchema");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload")



branchController.post('/create', async (req, res) => {
    try {
      
        const userData = { ...req.body }; 
        const branchCreated = await Branch.create(userData);

        sendResponse(res, 200, "Success", {
            success: true,
            message: "Branch created successfully!",
            userData: branchCreated
        });

    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});



branchController.get("/getBranch", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10 if not provided

        // Calculate skip value for pagination
        const skip = (page - 1) * pageSize;

        // Fetch the paginated eligibility forms
        const data = await Branch.find().skip(skip).limit(pageSize);

        sendResponse(res, 200, "Success", {
            success: true,
            message: "All Branch list retrieved successfully!",
            data: data
        });
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});


branchController.put("/updateBranch", async (req, res) => {
    try {
      const filter = { _id: req.body._id };
      const update = req.body;
  
      // Update the employee data
      const data = await Branch.updateOne(filter, update, { new: true });
  
      sendResponse(res, 200, "Success", {
        success: true,
        message: "Branch updated successfully!",
        data: data
      });
    } catch (error) {
      console.log(error);
      sendResponse(res, 500, "Failed", {
        message: error.message || "Internal server error",
      });
    }
  });



  branchController.delete("/delete/:id",  async (req, res) => {
    try {
      const branchId = req.params.id;
  
      // Find the log entry in the database based on logId
      const branchToDelete = await Branch.findById(branchId);
  
  
      if (!branchToDelete) {
        return sendResponse(res, 404, "Not Found", {
          success: false,
          message: "Branch entry not found"
        });
      }
  
      // Delete the log entry
      await branchToDelete.deleteOne();
  
      sendResponse(res, 200, "Success", {
        success: true,
        message: "Branch entry deleted successfully"
      });
    } catch (error) {
      console.error(error);
      sendResponse(res, 500, "Failed", {
        success: false,
        message: error.message || "Internal server error"
      });
    }
});  
  

module.exports = branchController;