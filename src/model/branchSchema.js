const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const branchSchema = mongoose.Schema({
    Company: {type: String},
    BranchLocation: {type: String},
    BranchCity: {type: String},
    Status: {type: String, enum: ['Active', 'Inactive'] }
});

branchSchema.plugin(timestamps);
module.exports = mongoose.model("Branch", branchSchema);

