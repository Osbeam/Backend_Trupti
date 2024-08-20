const mongoose = require("mongoose");
const BussinessIncome = require("../model/bussinessIncomeSchema");
const { body } = require("express-validator");


exports.updateBussinessIncome = async (id, updatedData) => {
  return await BussinessIncome.findByIdAndUpdate(id, updatedData, { new: true });
};

exports.createBussinessIncome = async (newData) => {
  const newBussinessIncome = new BussinessIncome(newData);
  return await newBussinessIncome.save();
};



exports.updateData = async (filter, update)=> {
  return await BussinessIncome.updateOne(filter, update, { new: true });
};