const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");


const homeLoanSchema = mongoose.Schema({
    AadharCard: { type: String },
    PanCard: { type: String },
    ZoneCertificate: { type: String },
    SaleDeed: { type: String },
    BluePrint: { type: String },
    PherPhar: { type: String },
    AtharUthara: { type: String },
    Saat12: { type: String },
    PropertiTaxDetails: { type: String },
    AgreementToSale: { type: String },
    CompletionCertificate: { type: String }
});

homeLoanSchema.plugin(timestamps);
module.exports = mongoose.model("HomeLoan", homeLoanSchema);
