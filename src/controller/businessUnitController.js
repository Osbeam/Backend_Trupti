const express = require("express");
const businessUnitController = express.Router();
const BusinessUnit = require("../model/businessUnitTypeSchema");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload")



const regions = [
    {
      name: "East",
      states: [
        {
          name: "West Bengal",
          zones: [{ name: "Zone 1", branches: ["Town/City"] }]
        },
        {
          name: "Odisha (Orissa)",
          zones: [{ name: "Zone 1", branches: ["Town/City"] }]
        },
        {
          name: "Andaman and Nicobar Islands (UT)",
          zones: [{ name: "Zone 1", branches: ["Town/City"] }]
        },
        {
          name: "Bihar",
          zones: [{ name: "Zone 2", branches: ["Town/City"] }]
        },
        {
          name: "Jharkhand",
          zones: [{ name: "Zone 2", branches: ["Town/City"] }]
        },
        {
          name: "Assam",
          zones: [{ name: "Zone 3", branches: ["Town/City"] }]
        },
        {
          name: "Sikkim",
          zones: [{ name: "Zone 3", branches: ["Town/City"] }]
        },
        {
          name: "Arunachal Pradesh",
          zones: [{ name: "Zone 3", branches: ["Town/City"] }]
        },
        {
          name: "Nagaland",
          zones: [{ name: "Zone 4", branches: ["Town/City"] }]
        },
        {
          name: "Manipur",
          zones: [{ name: "Zone 4", branches: ["Town/City"] }]
        },
        {
          name: "Mizoram",
          zones: [{ name: "Zone 4", branches: ["Town/City"] }]
        },
        {
          name: "Tripura",
          zones: [{ name: "Zone 4", branches: ["Town/City"] }]
        },
        {
          name: "Meghalaya",
          zones: [{ name: "Zone 4", branches: ["Town/City"] }]
        }
      ]
    },
    {
      name: "West",
      states: [
        {
          name: "Maharashtra",
          zones: [{ name: "Zone 1", branches: ["Town/City"] }]
        },
        {
          name: "Goa",
          zones: [{ name: "Zone 1", branches: ["Town/City"] }]
        },
        {
          name: "Gujarat",
          zones: [{ name: "Zone 2", branches: ["Town/City"] }]
        },
        {
          name: "Dadra and Nagar Haveli and Daman and Diu (UT)",
          zones: [{ name: "Zone 2", branches: ["Town/City"] }]
        },
        {
          name: "Rajasthan",
          zones: [{ name: "Zone 2", branches: ["Town/City"] }]
        }
      ]
    },
    {
      name: "Central",
      states: [
        {
          name: "Chhattisgarh",
          zones: [{ name: "Zone 1", branches: ["Town/City"] }]
        },
        {
          name: "Madhya Pradesh",
          zones: [{ name: "Zone 1", branches: ["Town/City"] }]
        }
      ]
    },
    {
      name: "North",
      states: [
        {
          name: "Delhi",
          zones: [{ name: "Zone 1", branches: ["Town/City"] }]
        },
        {
          name: "Uttar Pradesh",
          zones: [{ name: "Zone 1", branches: ["Town/City"] }]
        },
        {
          name: "Uttarakhand",
          zones: [{ name: "Zone 1", branches: ["Town/City"] }]
        },
        {
          name: "Punjab",
          zones: [{ name: "Zone 2", branches: ["Town/City"] }]
        },
        {
          name: "Chandigarh",
          zones: [{ name: "Zone 2", branches: ["Town/City"] }]
        },
        {
          name: "Haryana",
          zones: [{ name: "Zone 2", branches: ["Town/City"] }]
        },
        {
          name: "Himachal Pradesh",
          zones: [{ name: "Zone 3", branches: ["Town/City"] }]
        },
        {
          name: "Jammu and Kashmir",
          zones: [{ name: "Zone 3", branches: ["Town/City"] }]
        },
        {
          name: "Ladakh",
          zones: [{ name: "Zone 3", branches: ["Town/City"] }]
        }
      ]
    },
    {
      name: "South",
      states: [
        {
          name: "Karnataka",
          zones: [{ name: "Zone 1", branches: ["Town/City"] }]
        },
        {
          name: "Andhra Pradesh",
          zones: [{ name: "Zone 1", branches: ["Town/City"] }]
        },
        {
          name: "Telangana",
          zones: [{ name: "Zone 1", branches: ["Town/City"] }]
        },
        {
          name: "Tamil Nadu",
          zones: [{ name: "Zone 2", branches: ["Town/City"] }]
        },
        {
          name: "Kerala",
          zones: [{ name: "Zone 2", branches: ["Town/City"] }]
        },
        {
          name: "Puducherry",
          zones: [{ name: "Zone 2", branches: ["Town/City"] }]
        },
        {
          name: "Lakshadweep (UT)",
          zones: [{ name: "Zone 2", branches: ["Town/City"] }]
        }
      ]
    }
  ];
  
 
  




businessUnitController.post('/create', async (req, res) => {
    try {
      
        const businessData = { ...req.body }; 
        const businessUnitCreated = await BusinessUnit.create(businessData);

        sendResponse(res, 200, "Success", {
        
            success: true,
            message: "Business Unit created successfully!",
            businessData: businessUnitCreated
        });

    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});



businessUnitController.get("/get", async (req, res) => {
    try {
        // Fetch all business units without pagination
        const data = await BusinessUnit.find();

        sendResponse(res, 200, "Success", {
            success: true,
            message: "All Business Unit list retrieved successfully!",
            data: data
        });
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
});



businessUnitController.put("/update", async (req, res) => {
    try {
      const filter = { _id: req.body._id };
      const update = req.body;
  
      // Update the employee data
      const data = await BusinessUnit.updateOne(filter, update, { new: true });
  
      sendResponse(res, 200, "Success", {
        success: true,
        message: "Business Unit updated successfully!",
        data: data
      });
    } catch (error) {
      console.log(error);
      sendResponse(res, 500, "Failed", {
        message: error.message || "Internal server error",
      });
    }
  });



  businessUnitController.delete("/delete/:id",  async (req, res) => {
    try {
      const businessId = req.params.id;
  
      // Find the log entry in the database based on logId
      const businessToDelete = await BusinessUnit.findById(businessId);
  
  
      if (!businessToDelete) {
        return sendResponse(res, 404, "Not Found", {
          success: false,
          message: "Business Unit entry not found"
        });
      }
  
      // Delete the log entry
      await businessToDelete.deleteOne();
  
      sendResponse(res, 200, "Success", {
        success: true,
        message: "Business Unit entry deleted successfully"
      });
    } catch (error) {
      console.error(error);
      sendResponse(res, 500, "Failed", {
        success: false,
        message: error.message || "Internal server error"
      });
    }
});  
  

module.exports = businessUnitController;