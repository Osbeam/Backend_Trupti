const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");


const personalLoanSchema = mongoose.Schema({
    AadharCard: { type: String },
    PanCard: { type: String },
    ElectricityBill: { type: String },
    RentAgreement: { type: String },
    KYCAadharCard: { type: String },
    KYCPanCard: { type: String },
    PassportPhoto: { type: String },
    BankStatement: { type: String },
    SalarySlip: { type: String },
    CompanyIdCard: { type: String },
    Appointmentletter: { type: String },
    RelievingLetter: { type: String },
    ReferenceDetails: [{
        Person1: { type: String }, 
        Name: { type: String }, 
        MobileNo: { type: String }, 
        EmailId: { type: String },  
        Person2: { type: String }, 
        Name: { type: String }, 
        MobileNo: { type: String }, 
        EmailId: { type: String }, 
    }],
    CoAppKYCAadharCard: { type: String },
    CoAppKYCPanCard: { type: String },
    CoAppPassportPhoto: { type: String },
});

personalLoanSchema.plugin(timestamps);
module.exports = mongoose.model("PersonalLoan", personalLoanSchema);
