const express = require("express");
const bussinessIncome = express.Router();
const bussinessServices = require("../services/bussinessIncomeServices");
const adminServices = require("../services/adminServices");
const BussinessIncome = require("../model/bussinessIncomeSchema");
const { sendResponse } = require("../utils/common");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const imgUpload = require("../utils/imageUpload");
const axios = require("axios");




async function fetchLocations() {
  const apiUrl =
    "https://api.data.gov.in/resource/9115b89c-7a80-4f54-9b06-21086e0f0bd7";
  const apiKey = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";
  const format = "json";

  try {
    const response = await axios.get(
      `${apiUrl}?api-key=${apiKey}&format=${format}`
    );
    return response.data.records; // Assuming 'records' is the key containing location data
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}



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
  "Wardha",
  "Wayanad",
  "Yavatmal",
  "Yelahanka",
  "Yemmiganur",
  "Yerraguntla"
];



bussinessIncome.put("/updateOrCreateBussiness/:id?", async (req, res) => {
  try {
    const { id } = req.params;
    const additionalData = req.body;

    // Fetch locations and add to the additionalData if needed
    const locations = await fetchLocations();
    additionalData.BusinessLocation = locations;

    let interestedCustomerData = null;

    if (id) {
      // Fetch the interested customer data by ID
      interestedCustomerData = await adminServices.getInterestedCustomer(id);
    }

    let newData;

    if (interestedCustomerData && interestedCustomerData.length > 0) {
      // Combine the interested customer data with the additional data
      newData = {
        ...interestedCustomerData[0]._doc, // Assuming you're using Mongoose and need to get the raw object
        ...additionalData,
      };
    } else {
      // Create new data with additionalData only
      newData = { ...additionalData };
    }

    // Check if a document exists in the BussinessIncome schema with the same ID
    let updatedBussinessIncome;
    if (id && interestedCustomerData && interestedCustomerData.length > 0) {
      updatedBussinessIncome = await BussinessIncome.findById(id);
    }

    if (updatedBussinessIncome) {
      // Update the existing document
      updatedBussinessIncome = await BussinessIncome.findByIdAndUpdate(
        id,
        newData,
        { new: true }
      );
    } else {
      // Create a new document
      updatedBussinessIncome = new BussinessIncome(newData);
      await updatedBussinessIncome.save();
    }

    // Respond with the updated or created data
    sendResponse(res, 200, "Success", {
      success: true,
      message: "Business Income updated or created successfully!",
      data: updatedBussinessIncome,
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


bussinessIncome.get("/getAllBusinessIncome", async (req, res) => {
  try {
   
    const currentPage = parseInt(req.query.currentPage) || 1; 
    const limit = parseInt(req.query.limit) || 10; 

    const skip = (currentPage - 1) * limit;

    const totalCount = await BussinessIncome.countDocuments();

    const businessIncomes = await BussinessIncome.find()
      .skip(skip)
      .limit(limit);

    sendResponse(res, 200, "Success", {
      success: true,
      message: "Business Income documents retrieved successfully!",
      data: businessIncomes,
      pagination: {
        currentPage,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});


bussinessIncome.get("/cities", (req, res) =>
  sendResponse(res, 200, "Success", {
    success: true,
    message: "Cities retrieve successfully!",
    Cities: City,
  })
);




module.exports = bussinessIncome;
