const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");


const ProfessionalIncomeSchema = mongoose.Schema({
    Name: { type: String },
    MobileNo1: { type: Number },
    LoanType: { type: String },
    IncomeType: {   
        type: [String],
        enum: ['BusinessIncome', 'ProfessionalIncome', 'SalaryIncome']  
    },
    LoanAmount: { type: String },
    PropertyLocation: { type: String },
    City: { type: [String] },
    ProfessionName: { type: String },
    TypeOfProfession: { type: String },
    ProfessionFormationType: { type: String },
    ProfessionFormationDate: { type: String },
    OfficeType: { type: String },
    OfficeOwnership: { type: String },
    OfficeLocation:{ type: String },
    ITRStatus: {
        type: [String], 
        enum: ['Yes', 'No']
    },
    YearWiseITR: [{
        FillingDate: { type: String },
        Profit: { type: String },
        TurnOver: { type: String },
      },
    ],
    CertificateOfPractice: {
        type: [String],
        enum: ['Yes', 'No']  
    },
    CertificateOfPracticeNumber: { type: String },
    DateOfCertificateOfPracticeNumber: { type: String },
    GstRegistration: {
        type: [String],
        enum: ['Yes', 'No']  
    },
    GstNumber: { type: String },
    DateOfGstRegistration: { type: String },
    ShopActLicence: {
        type: [String],
        enum: ['Yes', 'No']  
    },
    ShopActLicenceNumber: { type: String },
    DateOfShopActLicenceNumber: { type: String },
    AadharUdhyog: {
        type: [String],
        enum: ['Yes', 'No']  
    },
    AadharUdhyogNumber: { type: String },
    DateOfAadharUdhyogNumber: { type: String },
    CurrentAccount: {
        type: [String],
        enum: ['Yes', 'No']  
    },
    AccountNumber: { type: String },
    DateOfOpening: { type: Date },
    BankAnalysis: { type: String },

});

ProfessionalIncomeSchema.plugin(timestamps);
module.exports = mongoose.model("ProfessionalIncome", ProfessionalIncomeSchema);
