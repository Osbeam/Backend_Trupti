const mongoose = require("mongoose");
const Admin = require("../model/adminSchema");
const { body } = require("express-validator");
const xlsx = require('xlsx');



async function processExcelFile(filePath) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetNameList = workbook.SheetNames;
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
    return sheetData;
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw error;
  }
}

async function saveExcelDataToDB(excelData) {
  try {
    const savedData = await SomeModel.insertMany(excelData);
    return savedData;
  } catch (error) {
    console.error('Error saving Excel data to DB:', error);
    throw error;
  }
}




async function getAllFiles(currentPage, pageSize) {
  const skip = (currentPage - 1) * pageSize;
  const getFile = await Admin.find().skip(skip).limit(pageSize);
  return getFile;
}



async function updateData(filter, update) {
  return await Admin.updateOne(filter, update, { new: true });
};




async function createData(body){
  const createfunction = await Admin.create(body);
  return createfunction;
}



async function getEmployeeCallStatus(id){
  return await Admin.find({CalledBy:id});
}



async function getAllEmployeeCallStatus(){
  return await Admin.find();
}


async function getInterestedCallStatus() {
  try {
    // Example: Retrieve interested call status data from a database
    const interestedCallStatusData = await Admin.find({ CallStatus: 'Interested' });

    const interestedCallsCount = interestedCallStatusData.length;

    return {
      interestedCallsCount,
      interestedCallStatusData
    };
  } catch (error) {
    throw new Error("Error retrieving interested call status data: " + error.message);
  }
}




async function getInterestedCustomer(id) {
  try {
    // Example: Retrieve interested call status data from a MongoDB collection
    const interestedCallStatusData = await Admin.find({
      _id: id,
      CallStatus: 'Interested'
    });

    return interestedCallStatusData;
  } catch (error) {
    throw new Error("Error retrieving interested call status data by customer ID: " + error.message);
  }
}



async function updateCustomer(filter, update) {
  return await Admin.updateOne(filter, update, { new: true });
};





async function getLeadFromData() {
  try {
    // Fetch distinct LeadFrom values from your database model
    const leadFromData = await YourDatabaseModel.distinct('LeadFrom', { LeadFrom: { $exists: true, $ne: null } });

    return leadFromData;
  } catch (error) {
    throw new Error(`Error fetching LeadFrom data: ${error.message}`);
  }
}






module.exports = {
  processExcelFile,
  saveExcelDataToDB,
  getAllFiles,
  createData,
  updateData,
  getEmployeeCallStatus,
  getAllEmployeeCallStatus,
  getInterestedCallStatus,
  getInterestedCustomer,
  updateCustomer,
  getLeadFromData
};

