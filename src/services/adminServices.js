const mongoose = require("mongoose");
const Admin = require("../model/adminSchema");
const Lead = require("../model/leadSchema");
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





async function getUnassignedFiles(currentPage, pageSize) {
  try {
    const skip = (currentPage - 1) * pageSize;
    const unassignedFiles = await Admin.find({ AssignedTo: { $in: [null, undefined] }, CallStatus: { $size: 0 } })
    .skip(skip).limit(pageSize);
    return unassignedFiles;
  } catch (error) {
    throw new Error(`Error fetching unassigned files: ${error.message}`);
  }
}



async function updateData(filter, update) {
  return await Admin.updateOne(filter, update, { new: true });
};




async function createData(body){
  const createfunction = await Admin.create(body);
  return createfunction;
}


async function createLeadData(body){
  const createfunction = await Lead.create(body);
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




async function getInterestedLeads(id) {
  try {
    // Example: Retrieve interested call status data from a MongoDB collection
    const interestedCallStatusData = await Lead.find({
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
    const leadFromData = await Lead.find({ 
      LeadFrom: { $exists: true }, 
      IsLead: false,
      AssignedTo: { $in: [null, undefined] }
    })
    .skip(skip)
    .limit(size);

    const leadFromCount = await Lead.countDocuments({ 
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
  return await Lead.updateOne(filter, update, { new: true });
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
    const pendingLeads = await Lead.find({ LeadCallStatus: 'Pending' })
      .skip(skip)
      .limit(limit);

    // Count total documents where LeadCallStatus is 'Pending'
    const totalLeads = await Lead.countDocuments({ LeadCallStatus: 'Pending' });

    return {
      pendingLeads,
      totalLeads
    };
  } catch (error) {
    throw new Error("Error retrieving pending leads: " + error.message);
  }
}





async function getAllLeadFromData(page, size) {
  try {
    const skip = (page - 1) * size;

    // Construct query based on CallStatus array and empty LeadCallStatus/AssignedTo
    const query = {
      LeadFrom: { $exists: true },
      CallStatus: { $size: 0 }, // Ensures CallStatus array is empty
      $or: [
        { LeadCallStatus: { $exists: false } },
        { LeadCallStatus: { $eq: "" } },
      ],
      $or: [
        { AssignedTo: { $exists: false } },
        { AssignedTo: { $eq: "" } },
      ]
    };

    // Fetch documents where LeadFrom field exists, CallStatus array is empty,
    // LeadCallStatus is empty or not present, and AssignedTo is empty or not present
    const leadFromData = await Lead.find(query)
      .skip(skip)
      .limit(size);

    // Count total documents matching the query
    const leadFromCount = await Lead.countDocuments(query);

    return {
      LeadFromData: leadFromData,
      LeadFromCount: leadFromCount
    };
  } catch (error) {
    throw new Error("Error retrieving LeadFrom data with pagination: " + error.message);
  }
}





module.exports = {
  processExcelFile,
  saveExcelDataToDB,
  getUnassignedFiles,
  createData,
  updateData,
  getEmployeeCallStatus,
  getAllEmployeeCallStatus,
  getInterestedCallStatus,
  getInterestedCustomer,
  updateCustomer,
  getLeadFromData,
  LeadupdateData,
  getInterestedCustomersByEmployee,
  getPendingLeads,
  getAllLeadFromData,
  createLeadData,
  getInterestedLeads
};

