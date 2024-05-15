const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const eligibilitySchema = mongoose.Schema({
    Name: {type: String},
    MobileNo: {type: String},
    LoanType: {type: String},
    LoanAmount: {type: String},
    CurrentLocation: {type: String},
    LocationIfOGL: {type: String},
    DOB: {type: String},
    PropertyType: {type: String},
    PropertySubType: {type: String},
    PropertyLocation: {type: String}
});

eligibilitySchema.plugin(timestamps);
module.exports = mongoose.model("Eligibility", eligibilitySchema);

