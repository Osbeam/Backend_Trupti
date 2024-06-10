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




async function getAllFiles() {
  const getFile = await Admin.find();
  return getFile;
}



async function updateData(filter, update) {
  return await Admin.updateOne(filter, update, { new: true });
};




async function createData(body){
  const createfunction = await Admin.create(body);
  return createfunction;
}




module.exports = {
  processExcelFile,
  saveExcelDataToDB,
  getAllFiles,
  createData,
  updateData
};

