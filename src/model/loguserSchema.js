const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");

const logUserSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeInfo' },
    inTimeImage: { type: String },
    inTime: { type: Date },
    outTime: { type: Date },
    totalHours: { type: String },
    approved: {type: Boolean, default: false},
    isPresent: {type: Boolean, default: false}
});

logUserSchema.plugin(timestamps);
module.exports = mongoose.model("LogUser", logUserSchema);