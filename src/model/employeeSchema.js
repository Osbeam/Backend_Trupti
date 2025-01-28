const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");

const employeeSchema = mongoose.Schema({
    MrMissMrs: { type: String },
    FirstName: { type: String, required: true },
    MiddleName: { type: String },
    LastName: { type: String, required: true },
    MobileNumber: { type: Number },
    Password: { type: String },
    EmailId: { type: String },
    EmployeeID: {type: String},
    Department: {type: String, ref: "Department"},
    SubDepartment: {type: String, ref: "SubDepartment"},
    Designation: {type: String, ref: "Designation"},
    Leaves: {type: String, ref: "LeaveManagement"},
    LogUsers: {type: String, ref: "LogUser"},
    DateOfBirth: {type: String},
    Gender: {
        type: [String],
        enum: ['Male', 'Female', 'Other']
    },
    BloodGroup: {
        type: [String],
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    CurrentAddress: {
        Caddress1: { type: String},
        Caddress2: { type: String},
        City1: { type: String },
        State1: { type: String},
        Pincode1: { type: String}
    },
    PermanentAddress: {
        Paddress1: { type: String },
        Paddress2: { type: String },
        City2: { type: String},
        State2: { type: String },
        Pincode2: { type: String}
    },
    HighestQualification: { type: String },
    Year: { type: String },
    TotalExperience: { type: String },
    LastCompanyName: { type: String },
    JoiningDate: { type: String },
    RellievingDate: { type: String },
    Reference1: { type: String },
    Relation1: { type: String },
    ContanctNumber1: { type: String },
    Address1: { type: String },
    ReferenceName2: { type: String },
    Relation2: { type: String },
    ContanctNumber2: { type: String },
    Address2: { type: String },
    DateOfJoining: { type: String },
    CompanyName: { type: String },
    BasicSalary: { type: String },
    HRA: { type: String },
    MedicalAllowance: { type: String },
    FixedAllowance: { type: String },
    Reimbursment: { type: String },
    SpecialAllowance: { type: String },
    VeriableAllowance: { type: String },
    AmountInWords: { type: String },
    AmountInDigits: { type: String },
    NoteBook: {
        type: [String],
        enum: ['Yes', 'No']
    },
    Stationery: {
        type: [String],
        enum: ['Yes', 'No']
    },
    JoiningKit: {
        type: [String],
        enum: ['Yes', 'No']
    },
    OfficialMobileNumber: { type: String },
    OfficialEmailId: { type: String },
    MobileIMEINumber: { type: String },
    PanCard: { type: String },
    AadharCard: { type: String },
    Photo: { type: String },
    AddressProof: { type: String },
    HighestQuaCertificate: { type: String },
    LastComRellievingLetter: { type: String },
    BankDetails: { type: String },
    BankName: { type: String },
    AccountHolderName: { type: String },
    AccountNumber: { type: String },
    IFSCCode: { type: String },
    CalenderDays: { type: String },
    WorkingDays: { type: String },
    PanNumber: { type: String },
    AadharNumber: { type: String },
    UANNumber: { type: String },
    TotalIncome: { type: String },
    DeductedIncome: { type: String },
    NetSalary: { type: String },
    NetSalaryInWords: { type: String },
    PF: { type: String },
    PT: { type: String },
    SalaryMonth: { type: Date },
    Role: {
        type: [String],
        enum: ['Admin', 'HR', 'Other', 'TeleCalling']
    },
    Position: { 
        type: [String],
        enum: ['TeamLeader', 'Manager', 'Boss', 'None']
     },
     ManagedBy: {type:String, ref: "EmployeeInfo", default: null},
     BranchLocation: {type:String, ref: "Branch"}
});

employeeSchema.plugin(timestamps);
module.exports = mongoose.model("EmployeeInfo", employeeSchema);

