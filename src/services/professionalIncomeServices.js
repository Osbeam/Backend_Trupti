const mongoose = require("mongoose");
const ProfessionalIncome = require("../model/professionalIncomeSchema");
const { body } = require("express-validator");



exports.updateData = async (filter, update)=> {
    return await ProfessionalIncome.updateOne(filter, update, { new: true });
  };