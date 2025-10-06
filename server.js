// server.js
const fs = require("fs");
const https = require("https");
const { Server } = require("socket.io");

// Load self-signed SSL certificate
const options = {
  key: fs.readFileSync("/etc/ssl/private/selfsigned.key"),  // path to your private key
  cert: fs.readFileSync("/etc/ssl/private/selfsigned.crt"), // path to your certificate
};

// Create HTTPS server
const server = https.createServer(options);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinDevice", (deviceId) => {
    console.log("Device joined:", deviceId);
  });

  // Example: send a test message every 10 seconds
  setInterval(() => {
    socket.emit("test", { msg: "Hello from server!" });
  }, 10000);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server on port 3003
server.listen(3003, () => {
  console.log("HTTPS Socket.IO server running on https://145.223.18.56:3003");
});
