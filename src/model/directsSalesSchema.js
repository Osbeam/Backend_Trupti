const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");


const directSalesSchema = mongoose.Schema({
    Name: { type: String },
    MobileNo: { type: Number },
    LoanType: {
        type: [String],
        enum: ['PersonalLoan', 'BussinessLoan', 'HomeLoan', 'LoanAgainstProperty',
             'PropertyProgram', 'VehicalLoan', 'EducationLoan', 'LetterOfCredit', 'CreditCard', 
             'AgricultureLoan', 'MechineryLoan']
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

directSalesSchema.plugin(timestamps);
module.exports = mongoose.model("DirectSales", directSalesSchema);
