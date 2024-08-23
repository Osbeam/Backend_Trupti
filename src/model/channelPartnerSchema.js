const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");

const channelPartnerSchema = mongoose.Schema({
    Name: { type: String, required: true },
    MobileNumber: { type: Number },
    Address: {
        address1: { type: String},
        address2: { type: String},
        City: { type: String },
        State: { type: String},
        Pincode: { type: String}
    },
    OfficeName: { type: String },
    BankName: { type: String },
    AccountNumber: { type: String },
    IFSCCode: { type: String },
    Product: {
        type: [String],
        enum: ['Loan', 'Insuarance', 'Investment']
    },
    PanCard: { type: String },
    AadharCard: { type: String },
    Photo: { type: String },
});

channelPartnerSchema.plugin(timestamps);
module.exports = mongoose.model("ChannelPartner", channelPartnerSchema);

