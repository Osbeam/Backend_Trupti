const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");


const loanFormSchema = mongoose.Schema({
    Name: { type: String },
    MobileNo1: { type: Number },
    EmailId: { type: String },
    LoanType: { type: String },
    LoanAmount: { type: String },
    City: { type: [String] }
});

loanFormSchema.plugin(timestamps);
module.exports = mongoose.model("LoanForm", loanFormSchema);
