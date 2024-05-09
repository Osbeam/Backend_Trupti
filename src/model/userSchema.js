const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const userSchema = mongoose.Schema({
    UserName: {type: String},
    Email: {type: String},
    MobileNumber: {type: Number},
    Designation: {type: String},
    Password: {type: String},
    TotalHours: {type: String}
});

userSchema.plugin(timestamps);
module.exports = mongoose.model("User", userSchema);

