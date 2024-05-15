const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const incomeEntrySchema = mongoose.Schema({
    IncomeType: {type: String},
    OtherIncome: {type: String},
    CoApplicantIncome: {type: String},
    CoApplicantIncomeType: {type: String},
    CoApplicantOtherIncome: {type: String},
    SalaryIncome: {type: String},
    PerMonth: {type: String},
    PerYear: {type: String},
    Businessincome: {type: String},
    ProfessionalIncome: {type: String}
});

incomeEntrySchema.plugin(timestamps);
module.exports = mongoose.model("IncomeEntry", incomeEntrySchema);
