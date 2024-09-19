const express = require("express");
const LoanFormController = express.Router();
const { sendResponse } = require("../utils/common");
const LoanForm = require("../model/loanFormSchema");
const PersonalLoan = require("../model/personalLoanSchema");
const BusinessLoan = require("../model/businessLoanSchema");
const HomeLoan = require("../model/homeLoanSchema");
const imgUpload = require("../utils/imageUpload");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });



const uploadimg = imgUpload.fields([
  { name: "Photo", maxCount: 1 },
  { name: "PanCard", maxCount: 1 },
  { name: "AadharCard", maxCount: 1 },
]);



LoanFormController.post("/loanForm", async (req, res) => {
  try {
    const loanData = { ...req.body };
    const loanCreated = await LoanForm.create(loanData);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Loan Form create successfully!",
      loanData: loanCreated,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


LoanFormController.post("/PersonalLoan", uploadimg, async (req, res) => {
  try {
    const loanData = { ...req.body };

    if (req.files) {
      if (req.files.PanCard) loanData.PanCard = req.files.PanCard[0].path;
      if (req.files.AadharCard)
        loanData.AadharCard = req.files.AadharCard[0].path;
      if (req.files.ElectricityBill)
        loanData.ElectricityBill = req.files.ElectricityBill[0].path;
      if (req.files.RentAgreement)
        loanData.RentAgreement = req.files.RentAgreement[0].path;
      if (req.files.KYCAadharCard)
        loanData.KYCAadharCard = req.files.KYCAadharCard[0].path;
      if (req.files.KYCPanCard)
        loanData.KYCPanCard = req.files.KYCPanCard[0].path;
      if (req.files.PassportPhoto)
        loanData.PassportPhoto = req.files.PassportPhoto[0].path;
      if (req.files.BankStatement)
        loanData.BankStatement = req.files.BankStatement[0].path;
      if (req.files.SalarySlip)
        loanData.SalarySlip = req.files.SalarySlip[0].path;
      if (req.files.CompanyIdCard)
        loanData.CompanyIdCard = req.files.CompanyIdCard[0].path;
      if (req.files.Appointmentletter)
        loanData.Appointmentletter = req.files.Appointmentletter[0].path;
      if (req.files.RelievingLetter)
        loanData.RelievingLetter = req.files.RelievingLetter[0].path;
      if (req.files.CoAppKYCAadharCard)
        loanData.CoAppKYCAadharCard = req.files.CoAppKYCAadharCard[0].path;
      if (req.files.CoAppKYCPanCard)
        loanData.CoAppKYCPanCard = req.files.CoAppKYCPanCard[0].path;
      if (req.files.CoAppPassportPhoto)
        loanData.CoAppPassportPhoto = req.files.CoAppPassportPhoto[0].path;
    }

    const loanCreated = new PersonalLoan(loanData);
    await loanCreated.save();

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Personal loan created successfully!",
      loanData: loanCreated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});


LoanFormController.post("/BusinessLoan", uploadimg, async (req, res) => {
  try {
    const loanData = { ...req.body };

    if (req.files) {
      if (req.files.PanCard) loanData.PanCard = req.files.PanCard[0].path;
      if (req.files.AadharCard)
        loanData.AadharCard = req.files.AadharCard[0].path;
      if (req.files.ElectricityBill)
        loanData.ElectricityBill = req.files.ElectricityBill[0].path;
      if (req.files.RentAgreement)
        loanData.RentAgreement = req.files.RentAgreement[0].path;
      if (req.files.KYCAadharCard)
        loanData.KYCAadharCard = req.files.KYCAadharCard[0].path;
      if (req.files.KYCPanCard)
        loanData.KYCPanCard = req.files.KYCPanCard[0].path;
      if (req.files.PassportPhoto)
        loanData.PassportPhoto = req.files.PassportPhoto[0].path;
      if (req.files.BankStatement)
        loanData.BankStatement = req.files.BankStatement[0].path;
      if (req.files.ShopAct) loanData.ShopAct = req.files.ShopAct[0].path;
      if (req.files.Itr) loanData.Itr = req.files.Itr[0].path;
      if (req.files.VintageProof)
        loanData.VintageProof = req.files.VintageProof[0].path;
      if (req.files.CoAppKYCAadharCard)
        loanData.CoAppKYCAadharCard = req.files.CoAppKYCAadharCard[0].path;
      if (req.files.CoAppKYCPanCard)
        loanData.CoAppKYCPanCard = req.files.CoAppKYCPanCard[0].path;
      if (req.files.CoAppPassportPhoto)
        loanData.CoAppPassportPhoto = req.files.CoAppPassportPhoto[0].path;
    }

    const loanCreated = new BusinessLoan(loanData);
    await loanCreated.save();

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Business loan created successfully!",
      loanData: loanCreated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});


LoanFormController.post("/HomeLoan", uploadimg, async (req, res) => {
  try {
    const loanData = { ...req.body };

    if (req.files) {
      if (req.files.PanCard) loanData.PanCard = req.files.PanCard[0].path;
      if (req.files.AadharCard)
        loanData.AadharCard = req.files.AadharCard[0].path;
      if (req.files.ZoneCertificate)
        loanData.ZoneCertificate = req.files.ZoneCertificate[0].path;
      if (req.files.SaleDeed)
        loanData.SaleDeed = req.files.SaleDeed[0].path;
      if (req.files.BluePrint)
        loanData.BluePrint = req.files.BluePrint[0].path;
      if (req.files.PherPhar)
        loanData.PherPhar = req.files.PherPhar[0].path;
      if (req.files.AtharUthara)
        loanData.AtharUthara = req.files.AtharUthara[0].path;
      if (req.files.Saat12)
        loanData.Saat12 = req.files.Saat12[0].path;
      if (req.files.PropertiTaxDetails)
        loanData.PropertiTaxDetails = req.files.PropertiTaxDetails[0].path;
      if (req.files.AgreementToSale)
        loanData.AgreementToSale = req.files.AgreementToSale[0].path;
      if (req.files.CompletionCertificate)
        loanData.CompletionCertificate = req.files.CompletionCertificate[0].path;
    }

    const loanCreated = new HomeLoan(loanData);
    await loanCreated.save();

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Home loan created successfully!",
      loanData: loanCreated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});


module.exports = LoanFormController;
