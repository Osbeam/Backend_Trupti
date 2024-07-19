const mongoose = require("mongoose");
const SalaryIncome = require("../model/salaryIncomeSchema");
const { body } = require("express-validator");


exports.createSalaryIncome = async (userData) => {
  const newSalaryIncome = new SalaryIncome(userData);
  return await newSalaryIncome.save();
};

exports.updateSalaryIncome = async (id, updatedData) => {
  return await SalaryIncome.findByIdAndUpdate(id, updatedData, { new: true });
};
