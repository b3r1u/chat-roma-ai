const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
require('dotenv').config();
console.log('API Key:', process.env.OPENAI_API_KEY);
const OpenAI = require('openai');

//importando as rotas
const openaiRoutes = require('./routes/openaiTextRoutes');
const openaiImageRoutes = require('./routes/openaiImageRoutes');
const dogImageRoutes = require('./routes/dogImageRoutes');
const catImageRoutes = require('./routes/catImageRoutes');

//instanciando o openai
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

app.use("/openai", openaiRoutes, openaiImageRoutes);
app.use("/dog-image", dogImageRoutes);
app.use("/cat-image", catImageRoutes);

io.on("connection", (socket) => {
  console.log("Usuário conectado " + socket.id);

  socket.on("message", (data) => {
    const messageData = { ...data, id: socket.id };
    io.emit("message", messageData);
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

