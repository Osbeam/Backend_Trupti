const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'EmployeeInfo', 
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'EmployeeInfo' 
  }, // For one-to-one messaging
  room: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'GroupChat' 
  }, // For group messaging
  content: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  fileUrl: { 
    type: String,
    required: false 
  },
  readBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    degfault:false,
    ref: 'EmployeeInfo'
  }], 
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
