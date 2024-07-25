const express = require("express");
const salaryIncome = express.Router();
const salaryServices = require("../services/salaryIncomeServices");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload");
const SalaryIncome = require('../model/salaryIncomeSchema'); 
const adminServices = require('../services/adminServices'); 
const axios = require('axios');



async function fetchLocations() {
  const apiUrl = 'https://api.data.gov.in/resource/9115b89c-7a80-4f54-9b06-21086e0f0bd7';
  const apiKey = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
  const format = 'json';


  try {
    const response = await axios.get(`${apiUrl}?api-key=${apiKey}&format=${format}`);
    return response.data.records; // Assuming 'records' is the key containing location data
  } catch (error) {
    console.error('Error fetching locations:', error);
    return []; 
  }
}





// salaryIncome.put("/updateOrCreateSalary/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const additionalData = req.body;

//        // Fetch locations and add to userData if needed
//        const locations = await fetchLocations();
//        additionalData.PropertyLocation = locations;

//     // Fetch the interested customer data by ID
//     const interestedCustomerData = await adminServices.getInterestedCustomer(id);

//     if (!interestedCustomerData || interestedCustomerData.length === 0) {
//       return sendResponse(res, 404, "Failed", {
//         message: "Interested customer data not found",
//       });
//     }

//     // Combine the interested customer data with the additional data
//     const newData = {
//       ...interestedCustomerData[0]._doc, // Assuming you're using Mongoose and need to get the raw object
//       ...additionalData,
//     };

//     // Check if a document exists in the SalaryIncome schema with the same ID
//     let updatedSalaryIncome = await SalaryIncome.findById(id);

//     if (updatedSalaryIncome) {
//       // Update the existing document
//       updatedSalaryIncome = await SalaryIncome.findByIdAndUpdate(id, newData, { new: true });
//     } else {
//       // Create a new document
//       newData._id = id; // Ensure the new document has the same ID
//       updatedSalaryIncome = new SalaryIncome(newData);
//       await updatedSalaryIncome.save();
//     }

//     // Respond with the updated or created data
//     sendResponse(res, 200, "Success", {
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




salaryIncome.put("/updateOrCreateSalary/:id?", async (req, res) => {
  try {
    let { id } = req.params;
    const additionalData = req.body;

    // Fetch locations and add to additionalData if needed
    const locations = await fetchLocations();
    additionalData.PropertyLocation = locations;

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







module.exports = salaryIncome;