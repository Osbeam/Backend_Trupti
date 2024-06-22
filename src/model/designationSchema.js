const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");

const designationSchema = mongoose.Schema({
    code: {type: String},
    name: {type: String},
    subDepartment:{ type: mongoose.Schema.Types.ObjectId, ref:"SubDepartment"}
});

designationSchema.plugin(timestamps);
module.exports = mongoose.model("Designation", designationSchema);