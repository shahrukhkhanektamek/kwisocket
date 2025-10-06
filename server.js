const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

// 👇 Serve static HTML files from "public" folder
app.use(express.static("public"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
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

  io.to(deviceId).emit(deviceId, { name, email, phone });
  res.json({ success: true });
});

server.listen(3003, () => console.log("Server running on port 3003"));
