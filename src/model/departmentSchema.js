const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const departmentSchema = mongoose.Schema({
    code: {type: String},
    name: {type: String},
    SubDepartment: [{type: String,  ref: "SubDepartment"}],
});

departmentSchema.plugin(timestamps);
module.exports = mongoose.model("Department", departmentSchema);