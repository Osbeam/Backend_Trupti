const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const eligibilitySchema = mongoose.Schema({
    EmployeeID: {type: String},
    Department: {type: String},
    SubDepartment: {type: String},
    Designation: {type: Number},
});

eligibilitySchema.plugin(timestamps);
module.exports = mongoose.model("Eligibility", eligibilitySchema);

