const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"]
        }
    });

const cors = require("cors");
app.use(cors());

// Lógica do Socket.IO
io.on("connection", (socket) => {
  console.log("Usuário conectado " + socket.id);

  socket.on("message", (msg) => {
    io.emit("message", { ...msg, id: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado");
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
