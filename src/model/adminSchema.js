const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");

const adminSchema = mongoose.Schema({
    DatabaseName:{type:String},
    DatabaseOwner:{type:String},
    DatabaseType:{type:String},
    Name:{type:String},
    MobileNo1:{type:String},
    MobileNo2:{type:String},
    EmailId:{type:String},
    Address:{type:String},
    PinCode:{type:String},
    Qualification:{type:String},
    Gender:{type:String},
    DateOfBirth:{type:String},
    Age:{type:String},
    IncomeType:{type:String},
    Income:{type:String},
    Industry:{type:String},
    CibilScore:{type:String},
    ExistingLoanAmt:{type:String},
    ExistingROI:{type:String},
    ExistingEMI:{type:String},
    IsCalled:{type:Boolean, default:false},
    CallStatus: {
        type: [String],
        enum: ['CallNotReceived', 'NotInterested', 'Interested', 'SwitchOff', 'Invalid', 'NotExists', 'FollowUp']
    }, 
    SubStatus: {type:String},
    FollowUpDate:{type:String},
    FollowUpTime:{type:String}, 
    Notes:{type:String}, 
    CalledBy:{type:String, ref: "User"}
});

adminSchema.plugin(timestamps);
module.exports = mongoose.model("Admin", adminSchema);

