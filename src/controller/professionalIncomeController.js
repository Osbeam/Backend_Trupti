const express = require("express");
const professionalIncome = express.Router();
const professionalIncomeServices = require("../services/professionalIncomeServices");
const adminServices = require("../services/adminServices");
const ProfessionalIncome = require("../model/professionalIncomeSchema");
const BusinessIncome = require("../model/bussinessIncomeSchema");
const Admin = require("../model/adminSchema");
const Lead = require("../model/leadSchema");
const SalaryIncome = require("../model/salaryIncomeSchema");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload");



const City = [
  "Agartala",
  "Agra",
  "Ahmedabad",
  "Aizawl",
  "Ajmer",
  "Alappuzha",
  "Aligarh",
  "Allahabad",
  "Ambala",
  "Amravati",
  "Amritsar",
  "Anantapur",
  "Aurangabad",
  "Bangalore",
  "Bareilly",
  "Belgaum",
  "Bhagalpur",
  "Bharatpur",
  "Bhilai",
  "Bhiwandi",
  "Bhopal",
  "Bhubaneswar",
  "Bikaner",
  "Bilaspur",
  "Bokaro Steel City",
  "Chandigarh",
  "Chennai",
  "Coimbatore",
  "Cuttack",
  "Dehradun",
  "Delhi",
  "Dhanbad",
  "Durgapur",
  "Erode",
  "Faridabad",
  "Firozabad",
  "Ghaziabad",
  "Gorakhpur",
  "Gulbarga",
  "Guntur",
  "Gurgaon",
  "Guwahati",
  "Gwalior",
  "Hubli",
  "Hyderabad",
  "Imphal",
  "Indore",
  "Jabalpur",
  "Jaipur",
  "Jalandhar",
  "Jammu",
  "Jamnagar",
  "Jamshedpur",
  "Jhansi",
  "Jodhpur",
  "Kannur",
  "Kanpur",
  "Karnal",
  "Kochi",
  "Kolkata",
  "Kollam",
  "Kozhikode",
  "Kurnool",
  "Latur",
  "Lucknow",
  "Ludhiana",
  "Madurai",
  "Malappuram",
  "Mathura",
  "Meerut",
  "Moradabad",
  "Mumbai",
  "Mysore",
  "Nagpur",
  "Nanded",
  "Nashik",
  "Nellore",
  "Noida",
  "Patna",
  "Pondicherry",
  "Prayagraj",
  "Pune",
  "Raipur",
  "Rajahmundry",
  "Rajkot",
  "Ranchi",
  "Rourkela",
  "Salem",
  "Sangli",
  "Shimla",
  "Siliguri",
  "Solapur",
  "Srinagar",
  "Surat",
  "Thanjavur",
  "Thiruvananthapuram",
  "Tiruchirappalli",
  "Tiruppur",
  "Udaipur",
  "Ujjain",
  "Vadodara",
  "Varanasi",
  "Vasai-Virar",
  "Vijayawada",
  "Visakhapatnam",
  "Warangal",
  "Yamunanagar",
  "Ahmednagar",
  "Ajmer",
  "Akola",
  "Aligarh",
  "Alwar",
  "Amroha",
  "Anand",
  "Arrah",
  "Asansol",
  "Bahraich",
  "Ballari",
  "Begusarai",
  "Bhagalpur",
  "Bharuch",
  "Bhavnagar",
  "Bhiwani",
  "Bidar",
  "Bulandshahr",
  "Chhapra",
  "Davanagere",
  "Dhule",
  "Dibrugarh",
  "Dimapur",
  "Etawah",
  "Farrukhabad",
  "Fatehpur",
  "Firozpur",
  "Gandhinagar",
  "Gaya",
  "Ghazipur",
  "Godhra",
  "Gopalpur",
  "Gulbarga",
  "Hajipur",
  "Haldwani",
  "Hisar",
  "Hoshangabad",
  "Idukki",
  "Jabalpur",
  "Jagdalpur",
  "Jalgaon",
  "Jalna",
  "Jalpaiguri",
  "Jammu",
  "Jamnagar",
  "Jamshedpur",
  "Jhansi",
  "Jodhpur",
  "Junagadh",
  "Kadapa",
  "Kakinada",
  "Kalyan-Dombivli",
  "Kamarhati",
  "Kancheepuram",
  "Karaikudi",
  "Karimnagar",
  "Karnal",
  "Karur",
  "Katni",
  "Kavali",
  "Kishanganj",
  "Kolhapur",
  "Kollam",
  "Kota",
  "Kottayam",
  "Kozhikode",
  "Kumbakonam",
  "Kurnool",
  "Latur",
  "Loni",
  "Madhubani",
  "Malda",
  "Mangalore",
  "Margoa",
  "Mathura",
  "Medinipur",
  "Mehsana",
  "Mirzapur",
  "Morena",
  "Muzaffarpur",
  "Nadiad",
  "Nagaon",
  "Nagercoil",
  "Nagapattinam",
  "Nagpur",
  "Nainital",
  "Namakkal",
  "Nanded",
  "Nandurbar",
  "Narasaraopet",
  "Navsari",
  "Nellore",
  "New Delhi",
  "Neyveli",
  "Nizamabad",
  "Noida",
  "Nokha",
  "Ongole",
  "Palakkad",
  "Palanpur",
  "Pali",
  "Panipat",
  "Parbhani",
  "Pathankot",
  "Patiala",
  "Phagwara",
  "Pondicherry",
  "Pudukkottai",
  "Raebareli",
  "Raichur",
  "Rajahmundry",
  "Rajapalayam",
  "Rajgarh",
  "Rajkot",
  "Raniganj",
  "Rajsamand",
  "Ramagundam",
  "Rampur",
  "Ranchi",
  "Ratlam",
  "Ratnagiri",
  "Rewa",
  "Rewari",
  "Rohtak",
  "Rourkela",
  "Sagar",
  "Saharanpur",
  "Salem",
  "Sambalpur",
  "Sangli",
  "Satara",
  "Satna",
  "Sehore",
  "Shahjahanpur",
  "Shimla",
  "Shillong",
  "Shimoga",
  "Sikar",
  "Silchar",
  "Siliguri",
  "Sindhudurg",
  "Singrauli",
  "Sirsa",
  "Sitapur",
  "Solan",
  "Sonipat",
  "South Dumdum",
  "Sri Ganganagar",
  "Srikakulam",
  "Srinagar",
  "Surat",
  "Tadepalligudem",
  "Tandur",
  "Tenali",
  "Tenkasi",
  "Tezpur",
  "Thanjavur",
  "Thiruvalla",
  "Thiruvananthapuram",
  "Thoothukudi",
  "Thrissur",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupati",
  "Tiruppur",
  "Tiruvannamalai",
  "Tonk",
  "Tumkur",
  "Udaipur",
  "Udgir",
  "Ujjain",
  "Ulhasnagar",
  "Ullal",
  "Umarkhed",
  "Unnao",
  "Vadodara",
  "Valsad",
  "Vapi",
  "Varanasi",
  "Vellore",
  "Veraval",
  "Vidisha",
  "Vijayawada",
  "Viluppuram",
  "Virar",
  "Virudhunagar",
  "Visakhapatnam",
  "Vizianagaram",
  "Warangal",
  "West Bengal",
  "Wardha",
  "Wayanad",
  "Yavatmal",
  "Yelahanka",
  "Yemmiganur",
  "Yerraguntla",
];


// professionalIncome.put("/updateOrCreateProfession/:id?", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const additionalData = req.body;

//     let interestedCustomerData = null;

//     if (id) {
//       // Try to fetch data from SalaryIncome first
//       interestedCustomerData = await Admin.findById(id).lean();
//       if (!interestedCustomerData) {
//         // If not found in SalaryIncome, fetch from Admin
//         interestedCustomerData = await SalaryIncome.findById(id).lean();
//         if (!interestedCustomerData) {
//           // If not found in Admin, fetch from BusinessIncome
//           interestedCustomerData = await BusinessIncome.findById(id).lean();
//           if (!interestedCustomerData) {
//             // If not found in Admin, fetch from LeadSchema
//             interestedCustomerData = await Lead.findById(id).lean();
//           }
//         }
//       }
//     }

//     let newData = { ...additionalData };

//     if (interestedCustomerData) {
//       // Combine the interested customer data with the additional data
//       newData = {
//         ...interestedCustomerData,
//         ...additionalData,
//       };
//     }

//     // Check if a document exists in the ProfessionalIncome schema with the same ID
//     let updatedProfessionalIncome;
//     if (id) {
//       updatedProfessionalIncome = await ProfessionalIncome.findById(id);
//     }

//     if (updatedProfessionalIncome) {
//       // Update the existing document
//       updatedProfessionalIncome = await ProfessionalIncome.findByIdAndUpdate(
//         id,
//         newData,
//         { new: true }
//       );
//     } else {
//       // Create a new document
//       newData._id = id; // Set the ID to the new document
//       updatedProfessionalIncome = new ProfessionalIncome(newData);
//       await updatedProfessionalIncome.save();
//     }

//     // Respond with the updated or created data
//     sendResponse(res, 200, "Success", {
//       success: true,
//       message: "Professional Income updated or created successfully!",
//       data: updatedProfessionalIncome,
//     });
//   } catch (error) {
//     console.error(error);
//     sendResponse(res, 500, "Failed", {
//       message: error.message || "Internal server error",
//     });
//   }
// });








const uploadFields = [
  { name: "UploadPhoto", maxCount: 1 },
  { name: "UploadAadhar", maxCount: 1 },
  { name: "UploadPan", maxCount: 1 },
  { name: "Upload3MonthSalarySlip", maxCount: 3 }, // Allow up to 3 files
  { name: "UploadBankStatement", maxCount: 1 },
];

professionalIncome.put("/updateOrCreateProfession/:id?", imgUpload.fields(uploadFields), async (req, res) => {
  try {
    const { id } = req.params;
    const additionalData = req.body;
    const files = req.files;

    let interestedCustomerData = null;

    if (id) {
      interestedCustomerData = await Admin.findById(id).lean();
      if (!interestedCustomerData) {
        interestedCustomerData = await SalaryIncome.findById(id).lean();
        if (!interestedCustomerData) {
          interestedCustomerData = await BusinessIncome.findById(id).lean();
          if (!interestedCustomerData) {
            interestedCustomerData = await Lead.findById(id).lean();
          }
        }
      }
    }

    let newData = { ...additionalData };

    if (files) {
      // Map the uploaded files to the respective fields
      Object.keys(files).forEach((key) => {
        if (files[key] && files[key].length > 0) {
          newData[key] = files[key].map((file) => file.path); // Store the file paths in an array
        }
      });
    }

    if (interestedCustomerData) {
      // Combine the interested customer data with the additional data
      newData = {
        ...interestedCustomerData,
        ...additionalData,
      };
    }

    // Check if a document exists in the ProfessionalIncome schema with the same ID
    let updatedProfessionalIncome;
    if (id) {
      updatedProfessionalIncome = await ProfessionalIncome.findById(id);
    }

    if (updatedProfessionalIncome) {
      // Update the existing document
      updatedProfessionalIncome = await ProfessionalIncome.findByIdAndUpdate(
        id,
        omitTimestamps(newData), // Exclude timestamps
        { new: true }
      );
    } else {
      // Create a new document
      newData._id = id; // Set the ID to the new document
      updatedProfessionalIncome = new ProfessionalIncome(omitTimestamps(newData));
      await updatedProfessionalIncome.save();
    }

    // Respond with the updated or created data
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Professional Income updated or created successfully!",
      data: updatedProfessionalIncome,
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});




professionalIncome.put("/EditProfessionalIncomesData", async (req, res) => {
  try {
    const data = await professionalIncomeServices.updateData({ _id: req.body._id }, req.body);
    sendResponse(res, 200, "Success", {
      success: true,
      message: "ProfessionalIncome Updated successfully!",
      data: data
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


module.exports = professionalIncome;