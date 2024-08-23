const mongoose = require("mongoose");
const ChannelPartner = require("../model/channelPartnerSchema");
const { body } = require("express-validator");



exports.getMember = async () => {
  const channelPartner = await ChannelPartner.find();
  return channelPartner;
};