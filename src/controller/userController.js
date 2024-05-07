const express = require("express");
const userController = express.Router();
const userServices = require("../services/userServices");
const LogUser = require("../model/loguserSchema");
const User = require("../model/userSchema");
const moment = require("moment");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/multer")
const jwt = require('jsonwebtoken');



userController.post("/register", async (req, res) => {
  try {
    // Check if the email or mobile number already exists in the database
    const existingUser = await User.findOne({
      $or: [{ Email: req.body.Email }, { MobileNumber: req.body.MobileNumber }]
    });

    if (existingUser) {
      // If user already exists with the same email or mobile number, send a response indicating the conflict
      sendResponse(res, 409, "Failed", {
        message: "Email or mobile number already exists"
      });
    } else {
      // If no existing user found, proceed with user creation
      const userCreated = await userServices.create(req.body);
      sendResponse(res, 200, "Success", {
        success: true,
        message: "Registered successfully!",
        userData: userCreated
      });
    }
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});



userController.post("/login", async (req, res) => {
  try {
    let message = "";
    const loggedUser = await userServices.login(req.body);
    if (loggedUser) {
      message = "logged in successfully";
    } else {
      message = "Invalid Userdetails";
    }
    let token = await jwt.sign({ loggedUser }, process.env.JWT_KEY);
    sendResponse(res, 200, "Success", {
      success: true,
      message: message,
      userData: { loggedUser, token },
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});



userController.post("/inTime", imgUpload.array("inTimeImage", 10), async (req, res) => {
  try {
    // Process uploaded images and build the photoArray
    const photoArray = req.files.map((file) => file.path);

    // Create a new log entry in the database
    const userLogData = {
      userId: req.body.userId,
      inTimeImage: photoArray[0], // Assuming the first image is the source image
      inTime: new Date(),
    };

    const logCreated = await LogUser.create(userLogData);

    // Fetch user data dynamically based on userId
    const userData = await User.findById(req.body.userId);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "User checkin successfully",
      user: logCreated
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      success: false,
      message: error.message || "Internal server error"
    });
  }
});



userController.put("/editInTime/:logId", imgUpload.array("inTimeImage", 10), async (req, res) => {
  try {
    const logId = req.params.logId;

    // Find the log entry in the database based on logId
    const existingLog = await LogUser.findById(logId);

    if (!existingLog) {
      return sendResponse(res, 404, "Not Found", {
        success: false,
        message: "Log entry not found"
      });
    }

    const photoArray = req.files.map((file) => file.path);

    // Update log data with new inTimeImage and inTime
    existingLog.inTimeImage = photoArray[0];
    existingLog.inTime = new Date();

    await existingLog.save();

    // Fetch user data dynamically based on userId
    const userData = await User.findById(existingLog.userId);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "In-time document updated successfully",
      user: userData, // Sending user data for reference
      log: existingLog // Sending updated log entry
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      success: false,
      message: error.message || "Internal server error"
    });
  }
});



userController.put("/outTime", async (req, res) => {
  try {
    // Retrieve inTime from the database
    const inTimeData = await userServices.getInTimeById({ _id: req.body.logId });
    const inTime = inTimeData.inTime;

    const userLogData = {
      outTime: new Date(),
      totalHours: req.body.totalHours
    };

    // Parse the times into Moment objects
    // const checkInMoment = moment(inTime);
    // const checkOutMoment = moment(userLogData.outTime);

    // Calculate the difference in time
    // const totalHours = moment.duration(checkOutMoment.diff(checkInMoment));

    // Add totalHours to userLogData
    // userLogData.totalHours = totalHours.asHours();
    // const hours = Math.floor(totalHours.asHours());
    // const minutes = Math.floor(totalHours.asMinutes()) % 60;
    // const formattedTotalHours = `${hours}hr ${minutes}min`;
    // userLogData.formattedTotalHours = formattedTotalHours;


    // Update user log data in the database
    const outTimeCreated = await userServices.logUserUpdate(req.body.logId, userLogData);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Out Time created successfully",
      logData: outTimeCreated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json
    ({ error: "Failed", message: error.message || "Internal server error" });
  }
});




userController.get("/getLogUserbyid", async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    const query = { userId };

  
    if (startDate) {
      query.inTime = { $gte: new Date(startDate) };
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999); 
      query.inTime = { ...query.inTime, $lte: endOfDay };
    }

    const data = await userServices.getLogUser(query);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Users Log list retrieved successfully!",
      data: data
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


userController.get("/getApprovedLogUsers", async (req, res) => {
  try {
    const { approved, startDate,  endDate} = req.query;
    const query = { approved };
  
    if (startDate) {
      query.inTime = { $gte: new Date(startDate) };
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999); 
      query.inTime = { ...query.inTime, $lte: endOfDay };
    }

    const data = await userServices.getLogUser(query);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Users Approved Log list retrieved successfully!",
      data: data
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


userController.get("/getLogUsers", async (req, res) => {
  try {
    const data = await userServices.getAllLogUser();
    sendResponse(res, 200, "Success", {
      success: true,
      message: "All Users Log list retrieved successfully!",
      data: data
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});



userController.delete("/deleteLog/:logId", async (req, res) => {
  try {
    const logId = req.params.logId;

    // Find the log entry in the database based on logId
    const logToDelete = await LogUser.findById(logId);


    if (!logToDelete) {
      return sendResponse(res, 404, "Not Found", {
        success: false,
        message: "Log entry not found"
      });
    }

    // Delete the log entry
    await logToDelete.deleteOne();

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Log entry deleted successfully"
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      success: false,
      message: error.message || "Internal server error"
    });
  }
});




userController.put("/editLogUser/:logId", async (req, res) => {
  try {
    const logId = req.params.logId;
    const updates = req.body;

    // Find the log entry in the database based on logId
    const existingLog = await LogUser.findById(logId);

    if (!existingLog) {
      return sendResponse(res, 404, "Not Found", {
        success: false,
        message: "Log entry not found"
      });
    }

    // Update log data with new field values
    Object.assign(existingLog, updates);
    existingLog.updatedAt = new Date(); // Update updatedAt timestamp

    await existingLog.save();

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Log entry updated successfully",
      log: existingLog
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      success: false,
      message: error.message || "Internal server error"
    });
  }
});




module.exports = userController;