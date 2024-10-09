const report = require("express").Router();
const reportService = require('../services/reportServices')
const { sendResponse } = require("../utils/common");

report.get('/callingreport', async (req, res) => {

    try {
        const { id, callstatus, leadcallstatus, date } = req.query

       const data = await reportService.getCallingReport(id, callstatus, leadcallstatus, date);

        sendResponse(res, 200, "Success", {
            success: true,
            message: "Calling Report retrieved successfully!",
            data: data,
        })
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed", {
            message: error.message || "Internal server error",
        });
    }
})

module.exports = report