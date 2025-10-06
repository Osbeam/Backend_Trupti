const { selectFields } = require("express-validator/src/field-selection");
const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");

const subDepartmentSchema = mongoose.Schema({
    code: {type: String},
    name: {type: String},
    department:{type:mongoose.Schema.Types.ObjectId, ref:"Department"},
    designation: [{type: mongoose.Schema.Types.ObjectId, ref:"Designation"}],
});

subDepartmentSchema.plugin(timestamps);
module.exports = mongoose.model("SubDepartment", subDepartmentSchema);
// sales
// telly sales
// relationship excute



// branch creation 
// selection 
