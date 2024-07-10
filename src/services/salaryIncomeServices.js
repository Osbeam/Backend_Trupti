const mongoose = require("mongoose");
const SalaryIncome = require("../model/salaryIncomeSchema");
const { body } = require("express-validator");


exports.createSalaryIncome = async (body) => {
  return await SalaryIncome.create(body);
};
