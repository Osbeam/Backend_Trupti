const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");


const bussinessIncomeSchema = mongoose.Schema({
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
    BusinessName: { type: String },
    TypeOfBusiness: { type: String },
    BusinessIndustry: { type: String },
    BusinessFormationType: { type: String },
    BusinessFormationDate: { type: String },
    OfficeType: { type: String },
    OfficeOwnership: { type: String },
    BusinessLocation:{ type: String },
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
    GstRegistration: {
        type: [String],
        enum: ['Yes', 'No']  
    },
    GstNumber: { type: String },
    DateOfGstRegistration: { type: String },
    IndustryRegistration: {
        type: [String],
        enum: ['Yes', 'No']  
    },
    IndustryNumber: { type: String },
    DateOfIndustryRegistration: { type: String },
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
    LeadId:{type: String },
    LeadDate:{type: String },
    SourcingChanel:{type: String },
    SourceName:{type: String },
    LeadName:{type: String },
    EmailId:{type: String },
    DateOfBirth:{type: String },
    Age:{type: String },
    Sex:{type: String },
    MaritalStatus:{type: String },
    ResidenceType:{type: String },
    ResidenceCity:{type: String },
    PermanentAddress:{type: String },
    PCity:{type: String },
    PPinCode:{type: String },
    PState:{type: String },
    FormationType:{type: String },
    OrganizationName:{type: String },
    OfficeType:{type: String },
    Designation:{type: String },
    CurrentExperience:{type: String },
    IndustryType:{type: String },
    Dated:{type: String },
    ExperienceProof:{type: String },
    Form26AS: {
        type: [String],
        enum: ['Yes', 'No']
    },
    PFApplicability: {
        type: [String],
        enum: ['Yes', 'No']
    },
    IncomeDetails: [{
        AssesmentYear: { type: String }, 
        GrossIncome: { type: String }, 
        NetIncome: { type: String }, 
        OtherIncome: { type: String }, 
        TotalIncome: { type: String },
        PaymentMode: { type: String },
        DateOfFilling: { type: Date }, 
    }],
    TurnOverDetails: [{
        TurnOver: { type: String }, 
        ITR: { type: String }, 
        GST: { type: String }, 
        Banking: { type: String }, 
        Export: { type: String },
        Other: { type: String },
    }],
    BankDetails: [{
        ABB: { type: String }, 
        DR1: { type: String }, 
        DR2: { type: String }, 
        DR3: { type: String }, 
        DR4: { type: String },
        DR5: { type: String },
    }],
    LoanEligibility:{type: String },
    LoanStage:{type: String },
});

bussinessIncomeSchema.plugin(timestamps);
module.exports = mongoose.model("BussinessIncome", bussinessIncomeSchema);
