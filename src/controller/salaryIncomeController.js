const express = require("express");
const salaryIncome = express.Router();
const salaryServices = require("../services/salaryIncomeServices");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload");
const SalaryIncome = require('../model/salaryIncomeSchema'); 
const ProfessionalIncome = require('../model/professionalIncomeSchema'); 
const BusinessIncome = require('../model/bussinessIncomeSchema'); 
const Lead = require('../model/leadSchema'); 
const Admin = require('../model/adminSchema'); 
const adminServices = require('../services/adminServices'); 



const omitTimestamps = (data) => {
  const { createdAt, updatedAt, ...rest } = data;
  return rest;
};

// Define the file fields for the schema
const uploadFields = [
  { name: "UploadPhoto", maxCount: 1 },
  { name: "UploadAadhar", maxCount: 1 },
  { name: "UploadPan", maxCount: 1 },
  { name: "Upload3MonthSalarySlip", maxCount: 3 },  // Allow up to 3 files
  { name: "UploadBankStatement3_6_12", maxCount: 3 },  // Allow up to 3 files
  { name: "AppointmentLetter", maxCount: 3 },  // Allow up to 3 files
  { name: "CompanyIdCard", maxCount: 3 },  // Allow up to 3 files
  { name: "SalarySlip1", maxCount: 3 },  // Allow up to 3 files
  { name: "SalarySlip2", maxCount: 3 },  // Allow up to 3 files
  { name: "SalarySlip3", maxCount: 3 },  // Allow up to 3 files
  { name: "AppraisalLetter", maxCount: 3 },  // Allow up to 3 files
  { name: "PreviousCompanyRelievingLetter", maxCount: 3 },  // Allow up to 3 files
  { name: "Form16_1", maxCount: 3 },  // Allow up to 3 files
  { name: "Form16_2", maxCount: 3 },  // Allow up to 3 files
  { name: "CurrentAddressProof", maxCount: 3 },  // Allow up to 3 files
  { name: "PermanentAddressProof", maxCount: 3 },  // Allow up to 3 files
  { name: "RelationshipProof", maxCount: 2 },
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
      // Merge data and exclude timestamps
      newData = {
        ...omitTimestamps(existingData),
        ...omitTimestamps(newData),
      };
    }

    let updatedSalaryIncome;
    if (id) {
      updatedSalaryIncome = await SalaryIncome.findById(id);
    }

    if (updatedSalaryIncome) {
      // Update the document
      updatedSalaryIncome = await SalaryIncome.findByIdAndUpdate(id, omitTimestamps(newData), { new: true });
    } else {
      // Create a new document
      newData._id = id; // Set the ID if provided
      updatedSalaryIncome = new SalaryIncome(omitTimestamps(newData));
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


salaryIncome.put("/EditSalaryData", imgUpload.fields(uploadFields), async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;  // Extract _id from body to use for filtering

    // Handle file uploads - If files are uploaded, map them to fields in updateData
    const files = req.files;  // Get the uploaded files

    if (files) {
      // Loop through the files and add them to the updateData object
      for (let uploadFields in files) {
        updateData[uploadFields] = files[uploadFields].map(file => file.path);  // Storing file paths
      }
    }

    // Call the service method to update the data
    const data = await salaryServices.updateData({ _id }, updateData);

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


salaryIncome.get('/getIncomeInfoByUser/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the data from each collection
    const salaryIncome = await SalaryIncome.find({ CreatedBy: id });
    const professionalIncome = await ProfessionalIncome.find({ CreatedBy: id });
    const businessIncome = await BusinessIncome.find({ CreatedBy: id });

    // Build the response data, excluding empty arrays
    const responseData = {};
    if (salaryIncome.length > 0) responseData.salaryIncome = salaryIncome;
    if (professionalIncome.length > 0) responseData.professionalIncome = professionalIncome;
    if (businessIncome.length > 0) responseData.businessIncome = businessIncome;

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Data retrieved successfully!",
      data: responseData
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      success: false,
      message: error.message || "Internal server error",
    });
  }
});


salaryIncome.get("/GetCustomerIncome/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;

    if (!customerId) {
      return sendResponse(res, 400, "Failed", {
        message: "customerId parameter is required",
      });
    }

    // Query each collection for documents with the given customerId
    const salaryIncomePromise = SalaryIncome.find({ _id: customerId }).lean();
    const businessIncomePromise = BusinessIncome.find({ _id: customerId }).lean();
    const professionalIncomePromise = ProfessionalIncome.find({ _id: customerId }).lean();

    // Await all promises simultaneously
    const [salaryIncomes, businessIncomes, professionalIncomes] = await Promise.all([
      salaryIncomePromise,
      businessIncomePromise,
      professionalIncomePromise,
    ]);

    // Determine the latest updatedAt for each category, defaulting to a minimal date if no documents are found
    const lastUpdatedTimes = [
      { type: 'salaryIncomes', updatedAt: salaryIncomes.length ? salaryIncomes[salaryIncomes.length - 1].updatedAt : new Date(0) },
      { type: 'businessIncomes', updatedAt: businessIncomes.length ? businessIncomes[businessIncomes.length - 1].updatedAt : new Date(0) },
      { type: 'professionalIncomes', updatedAt: professionalIncomes.length ? professionalIncomes[professionalIncomes.length - 1].updatedAt : new Date(0) }
    ];

    // Sort the categories by updatedAt in ascending order (earliest first)
    lastUpdatedTimes.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));

    // Prepare the response data, ordered by the sorted updatedAt times
    const userIncomes = {};
    lastUpdatedTimes.forEach(category => {
      if (category.type === 'salaryIncomes' && salaryIncomes.length) {
        userIncomes.salaryIncomes = salaryIncomes;
      }
      if (category.type === 'businessIncomes' && businessIncomes.length) {
        userIncomes.businessIncomes = businessIncomes;
      }
      if (category.type === 'professionalIncomes' && professionalIncomes.length) {
        userIncomes.professionalIncomes = professionalIncomes;
      }
    });

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Customer income retrieved successfully!",
      data: userIncomes,
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


salaryIncome.put('/updateIncome/:id', imgUpload.fields([
  { name: "UploadPhoto", maxCount: 1 },
  { name: "UploadAadhar", maxCount: 1 },
  { name: "UploadPan", maxCount: 1 },
  { name: "Upload3MonthSalarySlip", maxCount: 3 },
  { name: "UploadBankStatement3_6_12", maxCount: 3 },
  { name: "UploadBankStatement6_12", maxCount: 3 },
  { name: "AppointmentLetter", maxCount: 3 },
  { name: "CompanyIdCard", maxCount: 3 },
  { name: "SalarySlip1", maxCount: 3 },
  { name: "SalarySlip2", maxCount: 3 },
  { name: "SalarySlip3", maxCount: 3 },
  { name: "AppraisalLetter", maxCount: 3 },
  { name: "PreviousCompanyRelievingLetter", maxCount: 3 },
  { name: "Form16_1", maxCount: 3 },
  { name: "Form16_2", maxCount: 3 },
  { name: "CurrentAddressProof", maxCount: 3 },
  { name: "PermanentAddressProof", maxCount: 3 },
  { name: "RelationshipProof", maxCount: 2 },

  // Business income specific fields
  { name: "BusinessRegistrationDocument", maxCount: 3 },
  { name: "BusinessVintageProof", maxCount: 3 },
  { name: "ITR1styear", maxCount: 3 },
  { name: "ITR2styear", maxCount: 3 },
  { name: "ITR3styear", maxCount: 3 },
  { name: "GstCertificate", maxCount: 3 },
  { name: "GSTR1_12Months", maxCount: 3 },
  { name: "GSTR3B12Months", maxCount: 3 },
  { name: "OfficeSetupPhoto", maxCount: 3 }
]), async (req, res) => {
  const { id } = req.params; // Document ID from URL
  const { IncomeType } = req.body; // IncomeType from request body
  const updateData = req.body; // Data to update from form-data
  const files = req.files; // All uploaded files

  // Validate the presence of incomeType and id
  if (!IncomeType) {
    return sendResponse(res, 400, 'Failed', {
      success: false,
      message: 'IncomeType must be provided.',
    });
  }

  try {
    // Define the schemas and their income types
    const schemas = [
      { model: SalaryIncome, IncomeType: 'SalaryIncome' },
      { model: ProfessionalIncome, IncomeType: 'ProfessionalIncome' },
      { model: BusinessIncome, IncomeType: 'BusinessIncome' }
    ];

    let updatedDocument = null;

    // Loop through schemas to find and update the document
    for (const { model, IncomeType: schemaIncomeType } of schemas) {
      // Check if the incomeType matches
      if (IncomeType !== schemaIncomeType) {
        continue; // Skip if incomeType doesn't match the schema
      }

      // Find document by ID and IncomeType
      const existingDocument = await model.findOne({ _id: id, IncomeType: schemaIncomeType });

      if (existingDocument) {
        // Dynamically iterate over each file field name
        for (const field of Object.keys(files)) {
          // If files for this field are present, map them to the corresponding field in the document
          if (files[field]) {
            updateData[field] = files[field].map(file => file.path);
          }
        }

        // Update the document with the new data
        updatedDocument = await model.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        break; // Exit loop after updating the first matching document
      }
    }

    // If no document is found, return 404
    if (!updatedDocument) {
      return sendResponse(res, 404, 'Failed', {
        success: false,
        message: `No document found with ID: ${id} and IncomeType: ${IncomeType}`,
      });
    }

    // Return success response with updated document
    return sendResponse(res, 200, 'Success', {
      success: true,
      message: 'Document updated successfully!',
      data: updatedDocument,
    });
  } catch (error) {
    // Handle errors
    return sendResponse(res, 500, 'Failed', {
      success: false,
      message: 'An error occurred while updating the document.',
      error: error.message,
    });
  }
});



module.exports = salaryIncome;