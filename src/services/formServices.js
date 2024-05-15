const mongoose = require("mongoose");
const Eligibility = require("../model/eligibilitySchema");
const IncomeEntry = require("../model/incomeEntrySchema");
const { body } = require("express-validator");



exports.createForm = async (body) => {
    return await Eligibility.create(body);
};



exports.getEligibilityForm = async (page, pageSize) => {
    const skip = (page - 1) * pageSize;
    const form = await Eligibility.find().skip(skip).limit(pageSize);
    return form;
};


exports.createIncomeForm = async (body) => {
    return await IncomeEntry.create(body);
};



exports.getIncomeForm = async (page, pageSize) => {
    const skip = (page - 1) * pageSize;
    const form = await IncomeEntry.find().skip(skip).limit(pageSize);
    return form;
};