const express = require("express");
const salaryIncome = express.Router();
const salaryServices = require("../services/salaryIncomeServices");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload");
const SalaryIncome = require('../model/salaryIncomeSchema'); 
const ProfessionalIncome = require('../model/professionalIncomeSchema'); 
const Lead = require('../model/leadSchema'); 
const BusinessIncome = require('../model/bussinessIncomeSchema'); 
const Admin = require('../model/adminSchema'); 
const adminServices = require('../services/adminServices'); 




// salaryIncome.put("/updateOrCreateSalary/:id?", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const additionalData = req.body;

//     let existingData = null;

//     if (id) {
//       // Try to fetch data from Admin first
//       existingData = await Admin.findById(id).lean();
//       if (!existingData) {
//         // If not found in Admin, fetch from BusinessIncome
//         existingData = await BusinessIncome.findById(id).lean();
//         if (!existingData) {
//           // If not found in Admin, fetch from ProfessionalIncome
//           existingData = await ProfessionalIncome.findById(id).lean();
//           if (!existingData) {
//             // If not found in Admin, fetch from LeadSchema
//             existingData = await Lead.findById(id).lean();
//           }
//         }
//       }
//     }

//     let newData = { ...additionalData };

//     if (existingData) {
//       // Combine the existing data with the additional data
//       newData = {
//         ...existingData,
//         ...additionalData,
//       };
//     }

//     // Check if a document exists in the SalaryIncome schema with the same ID
//     let updatedSalaryIncome;
//     if (id) {
//       updatedSalaryIncome = await SalaryIncome.findById(id);
//     }

//     if (updatedSalaryIncome) {
//       // Update the existing document
//       updatedSalaryIncome = await SalaryIncome.findByIdAndUpdate(id, newData, { new: true });
//     } else {
//       // Create a new document
//       newData._id = id; // Set the ID to the new document
//       updatedSalaryIncome = new SalaryIncome(newData);
//       await updatedSalaryIncome.save();
//     }

//     // Respond with the updated or created data
//     sendResponse(res, 200, "Success", {
//       success: true,
//       message: "Salary Income updated or created successfully!",
//       data: updatedSalaryIncome,
//     });
//   } catch (error) {
//     console.error(error);
//     sendResponse(res, 500, "Failed", {
//       message: error.message || "Internal server error",
//     });
//   }
// });





// Define the file fields for the schema
const uploadFields = [
  { name: "UploadPhoto", maxCount: 1 },
  { name: "UploadAadhar", maxCount: 1 },
  { name: "UploadPan", maxCount: 1 },
  { name: "Upload3MonthSalarySlip", maxCount: 3 },  // Allow up to 3 files
  { name: "UploadBankStatement", maxCount: 2 },
];

salaryIncome.put("/updateOrCreateSalary/:id?", imgUpload.fields(uploadFields), async (req, res) => {
  try {
    const { id } = req.params;
    const additionalData = req.body;
    const files = req.files;

    let existingData = null;

    if (id) {
      existingData = await Admin.findById(id).lean() ||
                     await BusinessIncome.findById(id).lean() ||
                     await ProfessionalIncome.findById(id).lean() ||
                     await Lead.findById(id).lean();
    }

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

    if (existingData) {
      newData = { ...existingData, ...newData };
    }

    let updatedSalaryIncome;
    if (id) {
      updatedSalaryIncome = await SalaryIncome.findById(id);
    }

    if (updatedSalaryIncome) {
      updatedSalaryIncome = await SalaryIncome.findByIdAndUpdate(id, newData, { new: true });
    } else {
      newData._id = id; // Set the ID if provided
      updatedSalaryIncome = new SalaryIncome(newData);
      await updatedSalaryIncome.save();
    }

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Salary Income updated or created successfully!",
      data: updatedSalaryIncome,
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});



salaryIncome.get("/GetAllSalaryIncome", async (req, res) => {
  try {
    // Extract pagination parameters from query
    const currentPage = parseInt(req.query.currentPage) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided

    // Calculate the number of documents to skip
    const skip = (currentPage - 1) * limit;

    // Fetch the total count of documents
    const totalCount = await SalaryIncome.countDocuments();

    // Fetch paginated documents from the SalaryIncome schema
    const salaryIncomes = await SalaryIncome.find()
      .skip(skip)
      .limit(limit);

    // Respond with the fetched data and pagination info
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Salary Income documents retrieved successfully!",
      data: salaryIncomes,
      pagination: {
        currentPage,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


salaryIncome.put("/EditSalaryData", async (req, res) => {
  try {
    const data = await salaryServices.updateData({ _id: req.body._id }, req.body);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Salary Updated successfully!",
      data: data
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


salaryIncome.get('/getAllIncomeInfo', async (req, res) => {
  try {
      // Fetch data from all schemas
      const businessIncome = await BusinessIncome.find({});
      const professionalIncome = await ProfessionalIncome.find({});
      const salaryIncome = await SalaryIncome.find({});

      // Combine the data into a single response
      const combinedData = {
          BusinessIncome: businessIncome,
          ProfessionalIncome: professionalIncome,
          SalaryIncome: salaryIncome,
      };

      sendResponse(res, 200, "Success", {
        success: true,
        message: "Data Retrieve successfully!",
        data: combinedData
      });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


// salaryIncome.get('/getIncomeInfo/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const salaryIncome = await SalaryIncome.find({CreatedBy:id});
//     const professionalIncome = await ProfessionalIncome.find({CreatedBy:id});
//     const businessIncome = await BusinessIncome.find({CreatedBy:id});

//     sendResponse(res, 200, "Success", {
//       success: true,
//       message: "Data retrieved successfully!",
//       data: {salaryIncome, professionalIncome, businessIncome}
//     });
//   } catch (error) {
//     console.log(error);
//     sendResponse(res, 500, "Failed", {
//       message: error.message || "Internal server error",
//     });
//   }
// });



salaryIncome.get('/getIncomeInfo/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch data from all collections
    const salaryIncome = await SalaryIncome.find({ CreatedBy: id }).lean();
    const professionalIncome = await ProfessionalIncome.find({ CreatedBy: id }).lean();
    const businessIncome = await BusinessIncome.find({ CreatedBy: id }).lean();

    let responseData = {};

    // Return only the first non-empty array based on creation order
    if (salaryIncome.length > 0) {
      responseData = { salaryIncome };
    } else if (professionalIncome.length > 0) {
      responseData = { professionalIncome };
    } else if (businessIncome.length > 0) {
      responseData = { businessIncome };
    }

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Data retrieved successfully!",
      data: responseData
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});




module.exports = salaryIncome;