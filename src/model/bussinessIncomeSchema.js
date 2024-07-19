const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");


const bussinessIncomeSchema = mongoose.Schema({
    BusinessName: { type: String },
    TypeOfBusiness: { type: String },
    BusinessIndustry: { type: String },
    BusinessFormationType: { type: String },
    BusinessFormationDate: { type: Date },
    OfficeType: { type: String },
    OfficeOwnership: { type: String },
    // BusinessLocation: { type: String },
    BusinessLocation: [{
        village_locality_name: { type: String },
        officename___bo_so_ho_: { type: String },
        pincode: { type: Number },
        sub_distname: { type: String },
        districtname: { type: String },
        statename: { type: String }
      }],
    ITRStatus: {
        type: [String],
        enum: ['Yes', 'No'] 
    },
    FillingDate: { type: String },
    Profit: { type: String },
    TurnOver: { type: String },
    GstRegistration: {
        type: [String],
        enum: ['Yes', 'No']  
    },
    GstNumber: { type: String },
    DateOfGstRegistration: { type: Date },
    IndustryRegistration: {
        type: [String],
        enum: ['Yes', 'No']  
    },
    IndustryNumber: { type: String },
    DateOfIndustryRegistration: { type: Date },
    CurrentAccount: {
        type: [String],
        enum: ['Yes', 'No']  
    },
    AccountNumber: { type: String },
    DateOfOpening: { type: Date },
    BankAnalysis: { type: String },
    Exporter: {
        type: [String],
        enum: ['Yes', 'No']  
    }, 
    ExportTurnoverLastYear: { type: String },
    TDSDeduction: {
        type: [String],
        enum: ['Yes', 'No']  
    },

});

bussinessIncomeSchema.plugin(timestamps);
module.exports = mongoose.model("BussinessIncome", bussinessIncomeSchema);
