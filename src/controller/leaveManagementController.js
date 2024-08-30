const express = require("express");
const leaveManagementController = express.Router();
const leaveManagementServices = require("../services/leaveManagementServices");
const LeaveManagement = require("../model/leaveManagementSchema");
const EmployeeInfo = require("../model/employeeSchema");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload")



const calculateLeaveDays = (StartDate, EndDate) => {
    const start = new Date(StartDate);
    const end = new Date(EndDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; 
};



leaveManagementController.post('/applyLeave', async (req, res) => {
    const { userId, leaveRequests } = req.body;

    if (!userId || !leaveRequests || !Array.isArray(leaveRequests)) {
        return sendResponse(res, 400, 'Bad Request', {
            success: false,
            message: 'User ID and an array of leave requests are required.'
        });
    }

    try {
        let leaveRecord = await LeaveManagement.findOne({ userId });

        if (!leaveRecord) {
            leaveRecord = new LeaveManagement({
                userId,
                LeaveBalances: {
                    SickLeave: { Available: 12, Taken: 0 },
                    EarnedLeave: { Available: 12, Taken: 0 },
                    CasualLeave: { Available: 8, Taken: 0 },
                    HolidayLeave: { Available: 4, Taken: 0 },
                    NationalHolidayLeave: { Available: 4, Taken: 0 }
                }
            });
        }

        const leaveResponses = [];
        
        for (const request of leaveRequests) {
            const { LeaveType, StartDate, EndDate, Reason } = request;

            const validLeaveTypes = ['SickLeave', 'EarnedLeave', 'CasualLeave', 'HolidayLeave', 'NationalHolidayLeave'];
            if (!validLeaveTypes.includes(LeaveType)) {
                return sendResponse(res, 400, 'Bad Request', {
                    success: false,
                    message: 'Invalid leave type.'
                });
            }

            const leaveCategory = leaveRecord.LeaveBalances[LeaveType];
            const leaveDays = calculateLeaveDays(StartDate, EndDate);

            if (leaveDays > leaveCategory.Available) {
                return sendResponse(res, 400, 'Bad Request', {
                    success: false,
                    message: 'Insufficient leave balance.'
                });
            }

            leaveCategory.Available -= leaveDays;
            leaveCategory.Taken += leaveDays;

            leaveRecord.LeaveHistory.push({
                LeaveType,
                StartDate,
                EndDate,
                Status: 'Pending',
                Reason,
                LeaveDays: leaveDays
            });

            leaveResponses.push({
                LeaveType,
                StartDate,
                EndDate,
                LeaveDays: leaveDays
            });
        }

        await leaveRecord.save();

        sendResponse(res, 201, 'Success', {
            success: true,
            message: 'Leave applied successfully.',
            data: leaveResponses
        });
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, 'Internal Server Error', {
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});




// Function to check if a half-day leave type is valid
const isValidHalfDayType = (type) => ["AM", "PM"].includes(type);

leaveManagementController.post('/applyHalfDayLeave', async (req, res) => {
    const { userId, LeaveType, Date, HalfDayType, Reason } = req.body;

    if (!userId || !LeaveType || !Date || !HalfDayType  || !Reason) {
        return res.status(400).json({
            success: false,
            message: 'User ID, leave type, date, and half-day type are required.'
        });
    }

    const validLeaveTypes = ['SickLeave', 'EarnedLeave', 'CasualLeave', 'HolidayLeave', 'NationalHolidayLeave'];
    if (!validLeaveTypes.includes(LeaveType) || !isValidHalfDayType(HalfDayType)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid leave type or half-day type.'
        });
    }
    try {
        let leaveRecord = await LeaveManagement.findOne({ userId });

        if (!leaveRecord) {

            leaveRecord = new LeaveManagement({ userId });
        }

        const deduction = 0.5; 

        const leaveCategory = leaveRecord.LeaveBalances[LeaveType];
        
        if (deduction > leaveCategory.Available) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient leave balance.'
            });
        }

        // Deduct leave balance and update taken leaves
        leaveCategory.Available -= deduction;
        leaveCategory.Taken += deduction;

        // Add leave entry to history
        leaveRecord.LeaveHistory.push({
            LeaveType,
            StartDate: Date,
            EndDate: Date,
            HalfDayType,
            Reason,
            IsHalfDay: true,
            Status: 'Pending'
        });

        // Save the updated leave record
        await leaveRecord.save();

        sendResponse(res, 201, 'Success', {
            success: true,
            message: 'Leave applied successfully.',
            data: leaveRecord
        });
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, 'Internal Server Error', {
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});


leaveManagementController.get('/getLeaveHistory/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const leaveRecord = await LeaveManagement.findOne({ userId });

        if (!leaveRecord) {
            return sendResponse(res, 404, 'Not Found', {
                message: 'Leave record not found for the specified user.',
            });
        }

        sendResponse(res, 200, 'Success', {
            success: true,
            message: 'Leave History Retrieve successfully.',
            data: leaveRecord.LeaveHistory,
        });
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, 'Internal Server Error', {
            message: error.message || 'Internal server error',
        });
    }
});


leaveManagementController.get('/getAllLeaveHistory', async (req, res) => {
    try {
        const leaveRecords = await LeaveManagement.find({}, 'LeaveHistory userId')
            .populate({
                path: 'userId',
                select: 'FirstName LastName',
                model: 'EmployeeInfo'
            })
            .exec();

        const allLeaveHistories = leaveRecords.map(record => ({
            userId: record.userId, 
            LeaveHistory: record.LeaveHistory
        }));

        sendResponse(res, 200, 'Success', {
            success: true,
            message: 'All leave histories retrieved successfully.',
            data: allLeaveHistories,
        });
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, 'Internal Server Error', {
            success: false,
            message: error.message || 'Internal server error',
        });
    }
});


leaveManagementController.get('/getLeaveBalance/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        let leaveRecord = await LeaveManagement.findOne({ userId });

        if (!leaveRecord) {
            // Create a new leave record if none exists
            leaveRecord = new LeaveManagement({
                userId,
                LeaveBalances: {
                    SickLeave: { Available: 12, Taken: 0 },
                    EarnedLeave: { Available: 12, Taken: 0 },
                    CasualLeave: { Available: 8, Taken: 0 },
                    HolidayLeave: { Available: 4, Taken: 0 },
                    NationalHolidayLeave: { Available: 4, Taken: 0 }
                }
            });

            await leaveRecord.save();
        }

        sendResponse(res, 200, 'Success', {
            success: true,
            message: 'Leave Balance Retrieved successfully.',
            data: leaveRecord.LeaveBalances,
        });
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, 'Internal Server Error', {
            success: false,
            message: error.message || 'Internal server error',
        });
    }
});


leaveManagementController.get('/getAllLeaveBalance', async (req, res) => {
    try {
        // Retrieve all leave records with associated employee names
        const leaveRecords = await LeaveManagement.find({}, 'userId LeaveBalances')
            .populate({
                path: 'userId',
                select: 'FirstName LastName',
                model: 'EmployeeInfo'
            })
            .exec();

        // Extract and structure the data to include leave balances and user details
        const leaveBalancesData = leaveRecords.map(record => ({
            userId: record.userId._id, // Include userId in the response
            Name: record.userId ? record.userId.FirstName : 'Unknown',
            Surname: record.userId ? record.userId.LastName : 'Unknown',
            LeaveBalances: record.LeaveBalances
        }));

        sendResponse(res, 200, 'Success', {
            success: true,
            message: 'All leave balances retrieved successfully.',
            data: leaveBalancesData,
        });
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, 'Internal Server Error', {
            success: false,
            message: error.message || 'Internal server error',
        });
    }
});




leaveManagementController.put('/updateLeaveStatus/:leaveId', async (req, res) => {
    const { leaveId } = req.params;
    const { status } = req.body;
    try {
        const leaveRecord = await LeaveManagement.findOne({ 'LeaveHistory._id': leaveId });

        if (!leaveRecord) {
            return sendResponse(res, 404, 'Not Found', {
                message: 'Leave request not found.',
            });
        }

        const leave = leaveRecord.LeaveHistory.id(leaveId);
        if (leave) {
            leave.Status = status;
        }

        await leaveRecord.save();

        sendResponse(res, 200, 'Success', {
            success: true,
            message: `Leave request ${status} successfully.`,
            data: leaveRecord,
        });
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, 'Internal Server Error', {
            message: error.message || 'Internal server error',
        });
    }
});


leaveManagementController.get('/getAllLeaveRequests', async (req, res) => {
    try {
        // Retrieve all leave records with associated employee names
        const leaveRequests = await LeaveManagement.find({}, 'LeaveHistory userId')
            .populate({
                path: 'userId',
                select: 'FirstName LastName',
                model: 'EmployeeInfo'
            })
            .exec();

        // Extract and structure the data to include only pending leave requests and user names
        const leaveRequestsWithDetails = leaveRequests.map(record => {
            // Filter leave history to include only pending requests
            const pendingLeaveHistory = record.LeaveHistory.filter(leave => leave.Status === 'Pending');

            return {
                userId: record.userId, // Include userId in the response
                // Name: record.userId ? record.userId.FirstName : 'Unknown',
                // Surname: record.userId ? record.userId.LastName : 'Unknown',
                LeaveHistory: pendingLeaveHistory
            };
        });

        sendResponse(res, 200, 'Success', {
            success: true,
            message: 'Pending leave requests retrieved successfully.',
            data: leaveRequestsWithDetails,
        });
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, 'Internal Server Error', {
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});



module.exports = leaveManagementController;