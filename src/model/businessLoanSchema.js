const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");


const businessLoanSchema = mongoose.Schema({
    AadharCard: { type: String },
    PanCard: { type: String },
    ElectricityBill: { type: String },
    RentAgreement: { type: String },
    KYCAadharCard: { type: String },
    KYCPanCard: { type: String },
    PassportPhoto: { type: String },
    BankStatement: { type: String },
    ShopAct: { type: String },
    Itr: { type: String },
    VintageProof: { type: String },
    ReferenceDetails: [{
        Name: { type: String }, 
        MobileNo: { type: String }, 
        EmailId: { type: String }, 
        Address: {
            Address1: { type: String},
            Address2: { type: String},
            City: { type: String },
            State: { type: String},
            Pincode: { type: String}
        }  
    }],
    CoAppKYCAadharCard: { type: String },
    CoAppKYCPanCard: { type: String },
    CoAppPassportPhoto: { type: String },
});

businessLoanSchema.plugin(timestamps);
module.exports = mongoose.model("BusinessLoan", businessLoanSchema);
