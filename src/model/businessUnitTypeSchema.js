const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const businessUnitTypeSchema = mongoose.Schema({
    BUType: { type: String, required: true, enum: ["Corporate", "Zonal", "Regional", "Branch", "State"] },
    BUName: { type: String, required: true, enum: ["Shaw Associates", "Shawniks Solution", "Damru Properties", "Osbeam IT"] },
    Region: { type: String, required: true, enum: ["East", "West", "North", "South", "Central"] },
    Zone: { type: String, required: true, enum: ["Zone1", "Zone2", "Zone3", "Zone4"] },
    State: { type: String, required: true },
    Branch: { type: String, required: true },
});

businessUnitTypeSchema.plugin(timestamps);
module.exports = mongoose.model("BusinessUnit", businessUnitTypeSchema);

