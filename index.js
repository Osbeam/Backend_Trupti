require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./src/route");
const socketIO = require('socket.io');
const http = require('http');


const app = express();
app.use('/uploads', express.static('uploads'))
const PORT = process.env.PORT || 8000;


app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());




// connecting with database
const mongoose = require("mongoose");


mongoose.connect(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Database connection successful");
}).catch(err => {
  console.error("Database connection error:", err);
});




const server1 = http.createServer(app);
const io = socketIO(server1, {
  cors: {
    origin: "*",
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {

  socket.on("connectSocket", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

  socket.on("disconnect", () => {
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key);
      }
    });
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});

// Make `io` available to your routes
app.use((req, res, next) => {
  req.io = io;
  next();
});


app.get("/", (req, res) => res.send(`Server listing on port ${PORT}`));
app.use("/api", routes);
app.all("*", (req, res) => res.status(404).json({ error: "404 Not Found" }));  




const server = server1.listen(PORT, () =>
  console.log(`Server running on ${process.env.BACKEND_URL}`)
);
