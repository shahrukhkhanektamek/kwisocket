const express = require("express");
const https = require("http"); // change from http
const fs = require("fs");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

// 👇 Serve static HTML files from "public" folder
app.use(express.static("public"));

// 🔹 Load SSL certificate
// const sslOptions = {
//   key: fs.readFileSync("/etc/ssl/private/selfsigned.key"), // path to your private key
//   cert: fs.readFileSync("/etc/ssl/private/selfsigned.crt"), // path to your cert
// };

// 🔹 Create HTTPS server instead of HTTP
const server = https.createServer(app);

// 🔹 Initialize Socket.IO
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Join device room
  socket.on("joinDevice", (deviceId) => {
    console.log(`Device joined: ${deviceId}`);
    socket.join(deviceId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Endpoint to trigger incoming request
app.post("/send-request", (req, res) => {
  const { deviceId, name, email, phone } = req.body;
  if (!deviceId || !name || !phone)
    return res.status(400).json({ message: "Missing parameters" });

  io.to(deviceId).emit(deviceId, req.body);
  res.json({ success: true });
});

// 🔹 Start HTTPS server
server.listen(3003, () =>
  console.log("HTTPS Socket.IO server running on https://145.223.18.56:3003")
);
