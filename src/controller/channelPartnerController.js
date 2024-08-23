const express = require("express");
const channelPartnerController = express.Router();
const channelPartnerServices = require("../services/channelPartnerServices");
const ChannelPartner = require("../model/channelPartnerSchema");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload");
const jwt = require("jsonwebtoken");


const uploadimg = imgUpload.fields([
    { name: "Photo", maxCount: 1 },
    { name: 'PanCard', maxCount: 1 },
    { name: 'AadharCard', maxCount: 1 }
]);


channelPartnerController.post("/addChannelPartner", uploadimg, async (req, res) => {
  try {
    const existingMember = await ChannelPartner.findOne({
      $or: [{ MobileNumber: req.body.MobileNumber }],
    });

    if (existingMember) {
      return res.status(409).send({
        success: false,
        message: "mobile number already exists",
      });
    }

    const memberData = { ...req.body };

    if (req.files) {
      if (req.files.Photo) memberData.Photo = req.files.Photo[0].path;
      if (req.files.PanCard) memberData.PanCard = req.files.PanCard[0].path;
      if (req.files.AadharCard) memberData.AadharCard = req.files.AadharCard[0].path;
    }

    const memberCreated = new ChannelPartner(memberData);
    await memberCreated.save();

    sendResponse(res, 200, "Success", {
      success: true,
      message: "ChannelPartner Added successfully!",
      memberData: memberCreated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});


channelPartnerController.get("/getChannelPartner", async (req, res) => {
    try {
      const data = await channelPartnerServices.getMember({});
      sendResponse(res, 200, "Success", {
        success: true,
        message: "All channel partner list retrieved successfully!",
        data: data,
      });
    } catch (error) {
      console.log(error);
      sendResponse(res, 500, "Failed", {
        message: error.message || "Internal server error",
      });
    }
  });



module.exports = channelPartnerController;