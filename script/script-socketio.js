const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");
require('dotenv').config(); // Carrega as variáveis de ambiente

// Importa corretamente a OpenAI (versão 4.x)
const OpenAI = require('openai');

// Cria uma nova instância do cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
const server = http.createServer(app);

// Configura para receber JSON no body das requisições POST
app.use(express.json());

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

  socket.on("message", async (msg) => {
    if (msg.text.startsWith("/text ")) {
      const userMessage = msg.text.replace("/text ", "").trim();

      try {
        // Chama a API OpenAI para gerar uma resposta de chat
        const openAiResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userMessage }],
        });

        const aiResponseText = openAiResponse.choices[0].message.content;

        io.emit("message", {
          text: aiResponseText,
          username: "OpenAI Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } catch (error) {
        console.error("Erro ao chamar a API da OpenAI: ", error);
        io.emit("message", {
          text: "Erro ao se conectar à OpenAI. Tente novamente mais tarde.",
          username: "OpenAI Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      }
    } else {
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

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
