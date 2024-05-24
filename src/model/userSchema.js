const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");

const userSchema = mongoose.Schema({
    EmployeeID: {type: String},
    UserName: {type: String},
    Email: {type: String},
    MobileNumber: {type: Number},
    Department: {type: String, ref: "Department"},
    SubDepartment: {type: String, ref: "SubDepartment"},
    Designation: {type: String, ref: "Designation"},
    Password: {type: String},
    TotalHours: {type: String}
});

userSchema.plugin(timestamps);
module.exports = mongoose.model("User", userSchema);

