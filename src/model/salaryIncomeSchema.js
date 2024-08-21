const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");


const salaryIncomeSchema = mongoose.Schema({
    Name: { type: String },
    MobileNo1: { type: Number },
    LoanType: { type: String },
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
    SalaryDetails: [{
        Month: { type: String }, 
        GrossSalary: { type: String }, 
        NetSalary: { type: String }, 
        OtherIncome: { type: String }, 
        TotalIncome: { type: String },
        PaymentMode: { type: String },
        DateOfPayment: { type: Date }, 
    }],
    BankDetails: [{
        ABB: { type: String }, 
        DR1: { type: String }, 
        DR2: { type: String }, 
        DR3: { type: String }, 
        DR4: { type: String },
        DR5: { type: String },
    }],
});

salaryIncomeSchema.plugin(timestamps);
module.exports = mongoose.model("SalaryIncome", salaryIncomeSchema);
