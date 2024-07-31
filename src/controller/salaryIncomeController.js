const express = require("express");
const salaryIncome = express.Router();
const salaryServices = require("../services/salaryIncomeServices");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload");
const SalaryIncome = require('../model/salaryIncomeSchema'); 
const adminServices = require('../services/adminServices'); 



// async function fetchLocations() {
//   const apiUrl = 'https://api.data.gov.in/resource/9115b89c-7a80-4f54-9b06-21086e0f0bd7';
//   const apiKey = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
//   const format = 'json';


//   try {
//     const response = await axios.get(`${apiUrl}?api-key=${apiKey}&format=${format}`);
//     return response.data.records; // Assuming 'records' is the key containing location data
//   } catch (error) {
//     console.error('Error fetching locations:', error);
//     return []; 
//   }
// }



salaryIncome.put("/updateOrCreateSalary/:id?", async (req, res) => {
  try {
    let { id } = req.params;
    const additionalData = req.body;

    let interestedCustomerData = null;

    if (id) {
      // Fetch the interested customer data by ID
      interestedCustomerData = await adminServices.getInterestedCustomer(id);
    }

    let newData;

    if (interestedCustomerData && interestedCustomerData.length > 0) {
      // Combine the interested customer data with the additional data
      newData = {
        ...interestedCustomerData[0]._doc, // Assuming you're using Mongoose and need to get the raw object
        ...additionalData,
      };
    } else {
      // Create new data with additionalData only
      newData = { ...additionalData };
    }

    // Check if a document exists in the SalaryIncome schema with the same ID
    let updatedSalaryIncome;
    if (id) {
      updatedSalaryIncome = await SalaryIncome.findById(id);
    }

    if (updatedSalaryIncome) {
      // Update the existing document
      updatedSalaryIncome = await SalaryIncome.findByIdAndUpdate(id, newData, { new: true });
    } else {
      // Create a new document
      updatedSalaryIncome = new SalaryIncome(newData);
      await updatedSalaryIncome.save();
    }

    // Respond with the updated or created data
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




module.exports = salaryIncome;