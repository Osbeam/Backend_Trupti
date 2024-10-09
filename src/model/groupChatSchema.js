const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');

const groupChatSchema = new mongoose.Schema({
  roomName: { 
    type: String, 
    required: true 
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'EmployeeInfo' 
  }],
  lastMessage: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Message' 
  },
  department: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department',
    required:false
  },
}, { timestamps: true });

module.exports  = mongoose.model('GroupChat', groupChatSchema);

