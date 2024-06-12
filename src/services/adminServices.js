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




// const getEmployeeCallStatus = async (CalledBy) => {
//   try {
//     const callStatusCounts = await Admin.aggregate([
//       { $match: { CalledBy: new mongoose.Types.ObjectId(CalledBy) } },
//       { $unwind: '$CallStatus' },
//       { $group: {
//           _id: '$CallStatus',
//           count: { $sum: 1 }
//       }}
//     ]);

//     // Convert the aggregation result to an object
//     const callStatusSummary = callStatusCounts.reduce((acc, status) => {
//       acc[status._id] = status.count;
//       return acc;
//     }, {});

//     return callStatusSummary;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };




module.exports = {
  processExcelFile,
  saveExcelDataToDB,
  getAllFiles,
  createData,
  updateData,
  getEmployeeCallStatus,
  getAllEmployeeCallStatus
};

