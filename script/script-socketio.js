const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500", 
    methods: ["GET", "POST"],
  },
});

app.use(express.static("public")); 

app.use(cors());

io.on("connection", (socket) => {
  console.log("Usuário conectado " + socket.id);

  socket.on("message", (msg) => {
    io.emit("message", {
      text: msg.text,
      username: msg.username,
      profilePic: msg.profilePic,
      id: socket.id,
    });
    console.log('OI')
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado " + socket.id);
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/chat.html");
});

server.on("error", (err) => {
  console.error("Server error: ", err);
});

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
