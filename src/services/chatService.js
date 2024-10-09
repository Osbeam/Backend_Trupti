const fs = require("fs");
const path = require("path");
const Message = require("../model/MessageSchema.js");
const { getFileExtension } = require("../utils/Functions.js");
const GroupChat = require("../model/groupChatSchema.js");
const EmployeeSchema = require('../model/employeeSchema.js');
const mongoose = require('mongoose')

const fetchMessages = async (sender, receiver) => {
    try {

        const messages = await Message.find({
            $or: [
                { sender: sender, receiver: receiver },
                { sender: receiver, receiver: sender },
                { room: receiver },
            ],
        })
            .sort({ timestamp: -1 })
            .limit(50)
            .populate({
                path: "sender",
                select: "FirstName LastName EmailId EmployeeID Department"
            }).populate({
                path: "receiver",
                select: "FirstName LastName EmailId EmployeeID Department"
            })
            .populate("room")
            .exec()
            ;


        return {
            messages
        }
    } catch (error) {
        throw new Error("Error retrieving calling report" + error.message);

    }
}

const sendMessages = async (messageData) => {
    try {
        let fileUrl = "";
        // If the message contains a file
        if (messageData.file) {
            const ext = getFileExtension(messageData.file);

            // Convert base64 string to buffer
            const fileBuffer = Buffer.from(
                messageData.file.split(",")[1],
                "base64"
            );

            // Generate a unique filename and store it
            const fileName = `upload-${Date.now()}.${ext}`; // Change extension based on file type
            const filePath = path.join(__dirname, "../uploads", fileName);

            fs.writeFileSync(filePath, fileBuffer);
            fileUrl = `/uploads/${fileName}`; // Path to the file
        }

        // Save the message to the database
        let message;
        if (messageData.type === 'one') {
            message = new Message({
                sender: messageData.sender,
                content: messageData.content || "",
                fileUrl: fileUrl || "",
                receiver: messageData.receiver,
                timestamp: new Date(), // Ensure timestamp is stored
            });
        }
        else {
            message = new Message({
                sender: messageData.sender,
                content: messageData.content || "",
                fileUrl: fileUrl || "",
                room: messageData.receiver,
                timestamp: new Date(), // Ensure timestamp is stored
            });
        }
        await message.save();
        return {
            message
        }
    } catch (error) {
        throw new Error("Error retrieving calling report" + error.message);
    }
}
const createGroup = async (roomDetails) => {
    try {
        const newRoomData = {
            roomName: roomDetails.roomName,
            members: roomDetails.members,
        };


        if (roomDetails.department && roomDetails.department.trim() !== "") {
            newRoomData.department = roomDetails.department;
        }

        const newRoom = await GroupChat.create(newRoomData);
        return {
            newRoom
        }
    } catch (error) {
        throw new Error("Error while creating groups" + error.message);

    }
}


const AddNewMemberInGroupChat = async (groupAndMemberDetails) => {
    try {
        // Fetch existing members of the group
        const allMembers = await GroupChat.findById(groupAndMemberDetails.groupId).select('members');

        // Convert all ObjectId instances and new members to strings to ensure uniqueness
        const existingMembers = allMembers.members.map(member => member.toString());
        const newMembers = groupAndMemberDetails.members.map(member => member.toString());

        // Merge the two arrays and use a Set to remove duplicates
        const filteredMembers = new Set([...existingMembers, ...newMembers]);

        // Convert the Set back to an array of ObjectId instances
        const uniqueMembers = Array.from(filteredMembers).map(member => new mongoose.Types.ObjectId(member));
        // Update the group with the new unique list of members
        let newRoom = 0;
        if (filteredMembers != allMembers) {
            newRoom = await GroupChat.findByIdAndUpdate(groupAndMemberDetails.groupId, {
                $set: {
                    members: uniqueMembers  // $set ensures the members array is replaced with uniqueMembers
                }
            }, { new: true }); // Returns the updated document
        }

        return {
            newRoom
        };
    } catch (error) {
        throw new Error("Error while adding new Member: " + error.message);
    }
};



const fetchGroupChat = async (userId) => {
    try {
        const chatRooms = await GroupChat.find({
            members: userId.members,

        }).populate({
            path: 'members',
            select: 'name'
        })
        return {
            chatRooms
        }
    } catch (error) {
        throw new Error("Error retrieving Group Chat." + error.message);

    }
}

const getAllUser = async () => {
    try {
        const Users = await EmployeeSchema.find().select('FirstName LastName');
        return {
            Users
        }
    } catch (error) {
        throw new Error("Error retrieving Users" + error.message);
    }
}

const getUserByDepartment = async (Department) => {
    try {
        const Users = await EmployeeSchema.find({
            Department: Department.department
        }).select('FirstName LastName');
        return {
            Users
        }
    } catch (error) {
        throw new Error("Error retrieving Users" + error.message);
    }
}
module.exports = {
    fetchMessages,
    sendMessages,
    createGroup,
    AddNewMemberInGroupChat,
    fetchGroupChat,
    getAllUser,
    getUserByDepartment
}