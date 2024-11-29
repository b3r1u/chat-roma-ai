const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
require('dotenv').config();
console.log('API Key:', process.env.OPENAI_API_KEY);
const OpenAI = require('openai');

//importnado as rotas


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const server = http.createServer(app);

app.use(express.json());
const audioRoutes = require("../backend/routes/audiosRoutes");
app.use(audioRoutes);

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(__dirname + "/public"));
app.use(cors());

io.on("connection", (socket) => {
  console.log("Usuário conectado " + socket.id);
  socket.on("message", (data) => {
    const messageData = { ...data, id: socket.id };
    io.emit("message", messageData);
  });

  socket.on("message", async (msg) => {
    {
      io.emit("message", {
        text: msg.text,
        username: msg.username,
        profilePic: msg.profilePic,
        id: socket.id,
      });
    }
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

server.listen(4000, () => {
  console.log("Servidor rodando na porta 4000");
});

router.get(`/${route}`, (req, res) => {
  const audioPath = path.join(
    __dirname,
    "..",
    "frontend",
    "public",
    "audios",
    sounds[route]
  );
  console.log(`Servindo arquivo de áudio: ${audioPath}`);
  res.sendFile(audioPath, (err) => {
    if (err) {
      console.error(`Erro ao enviar arquivo ${audioPath}:`, err);
    }
  });
});
