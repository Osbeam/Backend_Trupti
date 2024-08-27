const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");


const leaveManagementSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeInfo' },
    LeaveBalances: {
        SickLeave: {
            Available: { type: Number, default: 12 },
            Taken: { type: Number, default: 0 },
        },
        EarnedLeave: {
            Available: { type: Number, default: 12 },
            Taken: { type: Number, default: 0 },
        },
        CasualLeave: {
            Available: { type: Number, default: 8 },
            Taken: { type: Number, default: 0 },
        },
        HolidayLeave: {
            Available: { type: Number, default: 4 },
            Taken: { type: Number, default: 0 },
        },
        NationalHolidayLeave: {
            Available: { type: Number, default: 4 },
            Taken: { type: Number, default: 0 },
        },
    },
    LeaveHistory: [
        {
            LeaveType: {
                type: String,
                enum: ['SickLeave', 'EarnedLeave', 'CasualLeave', 'HolidayLeave', 'NationalHolidayLeave'],
                required: true
            },
            StartDate: { type: String },
            EndDate: { type: String },
            Status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
            Reason: { type: String },
            AppliedAt: { type: Date, default: Date.now },
            HalfDayType: { 
                type: String,  enum: ['AM', 'PM'],  default: null}, 
            IsHalfDay: { type: Boolean, default: false } ,
            LeaveDays: {type: String}
        }
    ],
});



leaveManagementSchema.plugin(timestamps);
module.exports = mongoose.model("LeaveManagement", leaveManagementSchema);





