const mongoose = require("mongoose");
const Admin = require("../model/adminSchema");
const Employee = require("../model/employeeSchema");
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



async function getAllEmployeeCallStatus() {
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



async function getLeadFromData(page, size) {
  try {
    const skip = (page - 1) * size;

    // Fetch all documents where LeadFrom field exists, IsLead is false, and AssignedTo is null or not present
    const leadFromData = await Admin.find({ 
      LeadFrom: { $exists: true }, 
      IsLead: false,
      AssignedTo: { $in: [null, undefined] }
    })
    .skip(skip)
    .limit(size);

    const leadFromCount = await Admin.countDocuments({ 
      LeadFrom: { $exists: true }, 
      IsLead: false,
      AssignedTo: { $in: [null, undefined] }
    });

    return {
      LeadFromData: leadFromData,
      LeadFromCount: leadFromCount
    };
  } catch (error) {
    throw new Error("Error retrieving LeadFrom data with pagination: " + error.message);
  }
}





async function LeadupdateData(filter, update) {
  return await Admin.updateOne(filter, update, { new: true });
};



async function getInterestedCustomersByEmployee(employeeId) {
  try {
    // Retrieve interested customers for the specified employee ID
    const interestedCustomers = await Admin.find({
      AssignedTo: employeeId,
      CallStatus: 'Interested'
    });

    return interestedCustomers;
  } catch (error) {
    throw new Error("Error retrieving interested customers by employee ID: " + error.message);
  }
}




async function getPendingLeads(page, limit) {
  try {
    const skip = (page - 1) * limit;

    // Retrieve documents where LeadCallStatus is 'Pending' with pagination
    const pendingLeads = await Admin.find({ LeadCallStatus: 'Pending' })
      .skip(skip)
      .limit(limit);

    // Count total documents where LeadCallStatus is 'Pending'
    const totalLeads = await Admin.countDocuments({ LeadCallStatus: 'Pending' });

    return {
      pendingLeads,
      totalLeads
    };
  } catch (error) {
    throw new Error("Error retrieving pending leads: " + error.message);
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
  // getEmployeeCallStatusByUserIds,
  getInterestedCallStatus,
  getInterestedCustomer,
  updateCustomer,
  getLeadFromData,
  LeadupdateData,
  getInterestedCustomersByEmployee,
  getPendingLeads
};

