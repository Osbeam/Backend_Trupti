const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");

const subDepartmentSchema = mongoose.Schema({
    code: {type: String},
    name: {type: String},
    department:{type:String, ref:"Department"},
    designation: [{
        name: {type: String},
        code:{type:String},
    }],
});

subDepartmentSchema.plugin(timestamps);
module.exports = mongoose.model("SubDepartment", subDepartmentSchema);