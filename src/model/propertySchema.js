const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");


const propertySchema = mongoose.Schema({
    Name: { type: String },
    MobileNo: { type: String },
    EmailId: { type: String },
    RequirementType: { type: String },
    PropertyType: { type: String },
    Interior: { type: String },
    PropertyCarpetArea: { type: String },
    PropertyCarpetArea2: { type: String },
    AminitiesCriteria: { type: String },
    ProjectType: { type: String },
    PossessionType: { type: String },
    Budget: { type: String },
    Location: { type: String },
    CPame: { type: String },
    EmployeeName: { type: String },
    SalesExecutive: { type: String },
    Priority: { type: String },
    PaymentType: { type: String },
    SaleDeed: { type: [String] },
    ChainAgreement : { type: [String] },
    MutationOrExtract7_12 : { type: [String] },
    Parcha: { type: [String] },
    Khajana_PropertyTax: { type: [String] },
    SanctionPlan: { type: [String] },
    ElectricityBill: { type: [String] },
    Quotation: { type: [String] },
    DraftAgreement: { type: [String] }
});

propertySchema.plugin(timestamps);
module.exports = mongoose.model("Property", propertySchema);
