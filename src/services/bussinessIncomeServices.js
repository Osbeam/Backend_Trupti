const mongoose = require("mongoose");
const BussinessIncome = require("../model/bussinessIncomeSchema");
const { body } = require("express-validator");


exports.createBussinessIncome = async (body) => {
  return await BussinessIncome.create(body);
};
