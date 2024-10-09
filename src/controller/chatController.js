const chatServices = require('../services/chatService.js')

const loadMessages = async ({ sender, receiver }, socket) => {
    try {

        const messages = await chatServices.fetchMessages(sender, receiver);
        // Emit messages back to the client
        socket.emit("loadMessages", messages);
    } catch (err) {
        console.error("Error loading messages:", err);
    }
};

const sendMessage = async (messageData, io) => {
    try {

        const message = await chatServices.sendMessages(messageData);

        // Broadcast the message to all connected clients
        io.emit("receiveMessage", message);
    } catch (err) {
        console.error("Error saving message:", err);
    }
};

const createGroupChat = async (roomDetails, io) => {
    try {
        const newRoom = await chatServices.createGroup(roomDetails);
        io.emit("createGroupChat", newRoom);
    } catch (error) {
        console.error("Error Creating Room", error);
    }
};

const AddNewMemberInGroupChat = async (groupAndMemberDetails, io) => {
    try {
        const newRoom = await chatServices.AddNewMemberInGroupChat(groupAndMemberDetails)
        if(newRoom === 0){
            console.log('All Member ALready Exists')
        }
        io.emit("newMember", newRoom);
    } catch (error) {
        console.error("Error Creating Room", error);
    }
};

const fetchGroupChat = async (userId, socket) => {
    try {

        const chatRooms = await chatServices.fetchGroupChat(userId)
        socket.emit('loadGroupChat', chatRooms)
    } catch (error) {
        console.error("Error loading chat rooms:", error);
    }
}

const getAllUser = async (socket) => {
    try {
        const Users = await chatServices.getAllUser();
        socket.emit("loadUser", Users);
    } catch (error) {
        console.error('Error while laoding users', error)
    }
}

const getUserByDepartment = async (department,socket) =>{
    try {
        const Users = await chatServices.getUserByDepartment(department);
        socket.emit("loadUserByDepartment", Users);
    } catch (error) {
        console.error('Error while laoding users by department', error)
    }
}


module.exports = { getAllUser, sendMessage, loadMessages, createGroupChat, AddNewMemberInGroupChat, fetchGroupChat,getUserByDepartment }