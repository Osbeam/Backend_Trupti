const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");


const incomeEntrySchema = mongoose.Schema({
    incomeType: {
        type: [String],
        enum: ['BusinessIncome', 'ProfessionalIncome', 'SalaryIncome']
    },
    incomePeriod: {
        type: [String],
        enum: ['PerYear', 'PerMonth']
    },
    NetSalary: { type: Number },
    OtherIncome: {
        type: [String],
        enum: ['SalaryIncome', 'RentalIncome', 'AgricultureIncome', 'CommissionIncome', 'OtherIncome']
    },
    CoApplicantIncome: {
        type: [String],
        enum: ['Yes', 'No']
    },
    CoApplicantIncomeType: {
        type: [String],
        enum: ['BusinessIncome', 'ProfessionalIncome', 'SalaryIncome']
    },
    CoApplicantIncomePeriod: {
        type: [String],
        enum: ['PerYear', 'PerMonth']
    },
    CoApplicantNetSalary: { type: Number },
    CoApplicantOtherIncome: {
        type: [String],
        enum: ['SalaryIncome', 'RentalIncome', 'AgricultureIncome', 'CommissionIncome', 'OtherIncome']
    }
});

incomeEntrySchema.plugin(timestamps);
module.exports = mongoose.model("IncomeEntry", incomeEntrySchema);
