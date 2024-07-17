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
    IsLead:{type:Boolean, default:false},
    AssignedTo:{type:String, ref: "EmployeeInfo"},
    IsCalled:{type:Boolean, default:false},
    LeadCallStatus: {
        type: [String],
        enum: ['Accept', 'Pending']
    },    
    CallStatus: {
        type: [String],
        enum: ['CallNotReceived', 'NotInterested', 'Interested', 'Connected', 'SwitchOff', 'Invalid', 'NotExists', 'FollowUp', 'NotConnected']
    }, 
    CallStatusUpdatedAt:{type: Date},
    CalledBy:{type:String, ref: "EmployeeInfo"}, 
    SubStatus: {type:String},
    FollowUpDate:{type:String},
    FollowUpTime:{type:String}, 
    Notes:{type:String}, 
    LoanType:{type:String},
    LoanAmount:{type:String},
    City:{type:String},
});

adminSchema.plugin(timestamps);
module.exports = mongoose.model("Admin", adminSchema);
