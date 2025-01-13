const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const cibilReportSchema = mongoose.Schema({
    CibilReport: {type: [String]},
    LoanStatemen: {type: [String]},
    ListOfDocuments : {type: [String]},
    SanctionLette : {type: [String]},
    ForeclosureLetter : {type: [String]},
    NOC : {type: [String]},
    
});

cibilReportSchema.plugin(timestamps);
module.exports = mongoose.model("Cibil Report", cibilReportSchema);

