const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");


const salaryIncomeSchema = mongoose.Schema({
    Name: { type: String },
    MobileNo1: { type: Number },
    LoanType: {
        type: [String],
        enum: ['PersonalLoan', 'BussinessLoan', 'HomeLoan', 'LoanAgainstProperty',
             'PropertyProgram', 'VehicalLoan', 'EducationLoan', 'LetterOfCredit', 'CreditCard', 
             'AgricultureLoan', 'MechineryLoan']
    },
    LoanAmount: { type: String },
    PropertyLocation:{ type: String }, 
    City: { type: [String] },
    IncomeType: {   
        type: [String],
        enum: ['BusinessIncome', 'ProfessionalIncome', 'SalaryIncome']  
    },
    GrossSalaryPerMonth:  {type: String},
    NetSalaryPerMonth:  {type: String},
    DeductionFromSalary: {
        type: [String],
        enum: ['ProvidentFund', 'ProfessionalTax', 'ESI', 'TDS']
    },
    Form16: {
        type: [String],
        enum: ['Yes', 'No']
    },
    LastTwoYearsForm16: {
        type: [String],
        enum: ['Yes', 'No']
    },
    CompanyName: { type: String },
    DateOfJoining: {type: String },
    CompanyFormedAs: {type: String },
    BelongFromIndustry: {type: String },
    PreviousCompanyName: {type: String },
    TotalWorkExperience: {type: String },
    AnotherSourceOfIncome:{
        type: [String],
        enum: ['Yes', 'No']
    },
    OtherSourceOfIncome:{
        type: [String],
        enum: ['BusinessIncome', 'ProfessionalIncome', 'SalaryIncome', 'Other']
    }
});

salaryIncomeSchema.plugin(timestamps);
module.exports = mongoose.model("SalaryIncome", salaryIncomeSchema);
