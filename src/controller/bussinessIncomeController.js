const express = require("express");
const bussinessIncome = express.Router();
const bussinessServices = require("../services/bussinessIncomeServices");
const adminServices = require("../services/adminServices");
const BussinessIncome = require("../model/bussinessIncomeSchema");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload");
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





// bussinessIncome.post("/createBussiness", async (req, res) => {
//   try {
//     const userData = { ...req.body };

//     // Fetch locations and add to userData if needed
//     const locations = await fetchLocations();
//     userData.BusinessLocation = locations;

//     // Assuming you have a service function for creating business income
//     const bussinessCreated = await bussinessServices.createBussinessIncome(userData);

//     // Respond with success message and created data
//     sendResponse(res, 200, "Success", {
//       success: true,
//       message: "Business Income form created successfully!",
//       userData: bussinessCreated,
//     });
//   } catch (error) {
//     console.error(error);
//     sendResponse(res, 500, "Failed", {
//       message: error.message || "Internal server error",
//     });
//   }
// });





// bussinessIncome.put("/updateOrCreateBussiness/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const additionalData = req.body;

//       // Fetch locations and add to userData if needed
//     const locations = await fetchLocations();
//     additionalData.BusinessLocation = locations;

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

//     // Check if a document exists in the BussinessIncome schema with the same ID
//     let updatedBussinessIncome = await BussinessIncome.findById(id);

//     if (updatedBussinessIncome) {
//       // Update the existing document
//       updatedBussinessIncome = await BussinessIncome.findByIdAndUpdate(id, newData, { new: true });
//     } else {
//       // Create a new document
//       newData._id = id; // Ensure the new document has the same ID
//       updatedBussinessIncome = new BussinessIncome(newData);
//       await updatedBussinessIncome.save();
//     }

//     // Respond with the updated or created data
//     sendResponse(res, 200, "Success", {
//       message: "Business Income updated or created successfully!",
//       data: updatedBussinessIncome,
//     });
//   } catch (error) {
//     console.error(error);
//     sendResponse(res, 500, "Failed", {
//       message: error.message || "Internal server error",
//     });
//   }
// });










module.exports = bussinessIncome;