const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const logUserSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    inTimeImage: { type: String },
    inTime: { type: Date },
    outTime: { type: Date },
    totalHours: { type: String }
});

logUserSchema.plugin(timestamps);
module.exports = mongoose.model("LogUser", logUserSchema);