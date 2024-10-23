const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://38e36f9b-66da-40e7-aa97-154dacdf0d0e-00-30acz2kkboipm.picard.replit.dev",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(__dirname + "/public"));
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
