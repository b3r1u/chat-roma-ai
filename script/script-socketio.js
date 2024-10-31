const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");
require('dotenv').config({ path: './script/token.env' }); 
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
const server = http.createServer(app);

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    
    methods: ["GET", "POST"],
  },
});

app.use(express.static(__dirname + "/public"));
app.use(cors());

// Endpoint para gerar imagem
app.post("/openai/image", async (req, res) => {
  const imageDescription = req.body.description;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: imageDescription,
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ url: response.data.data[0].url });
  } catch (error) {
    console.error("Erro ao gerar imagem: ", error);
    res.status(500).json({ error: "Erro ao gerar imagem" });
  }
});


// Endpoint para buscar imagem de gato
app.get("/cat", async (req, res) => {
  try {
    const response = await axios.get("https://api.thecatapi.com/v1/images/search");
    const catImageUrl = response.data[0].url;  
    res.json({ url: catImageUrl });
  } catch (error) {
    console.error("Erro ao buscar imagem de gato: ", error);
    res.status(500).json({ error: "Erro ao buscar imagem de gato" });
  }
});

// Endpoint para buscar uma imagem aleatória de Lorem Picsum
app.get("/random-image", async (req, res) => {
  try {
    const response = await axios.get("https://picsum.photos/500");
    const randomImageUrl = response.request.res.responseUrl; 

    res.json({ url: randomImageUrl });
  } catch (error) {
    console.error("Erro ao buscar imagem aleatória: ", error);
    res.status(500).json({ error: "Erro ao buscar imagem aleatória" });
  }
});

app.get("/artwork-image", async (req, res) => {
  try {
    const response = await axios.get("https://api.artic.edu/api/v1/artworks?page=1&limit=100");
    const artworks = response.data.data;

    // Filtra apenas as obras que possuem imagem
    const artworksWithImage = artworks.filter(artwork => artwork.image_id);
    const randomArtwork = artworksWithImage[Math.floor(Math.random() * artworksWithImage.length)];

    const imageUrl = `https://www.artic.edu/iiif/2/${randomArtwork.image_id}/full/843,/0/default.jpg`;
    res.json({
      title: randomArtwork.title,
      artist: randomArtwork.artist_title,
      url: imageUrl
    });
  } catch (error) {
    console.error("Erro ao buscar imagem de obra de arte: ", error);
    res.status(500).json({ error: "Erro ao buscar imagem de obra de arte" });
  }
});

app.get("/dog-image", async (req, res) => {
  try {
    const response = await axios.get("https://dog.ceo/api/breeds/image/random");
    const dogImageUrl = response.data.message;
    res.json({ url: dogImageUrl });
  } catch (error) {
    console.error("Erro ao buscar imagem de cachorro: ", error);
    res.status(500).json({ error: "Erro ao buscar imagem de cachorro" });
  }
});

io.on("connection", (socket) => {
  console.log("Usuário conectado " + socket.id);

  socket.on("message", async (msg) => {
    if (msg.text.startsWith("/text ")) {
      const userMessage = msg.text.replace("/text ", "").trim();

      try {
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

    } else if (msg.text.startsWith("/image ")) {
      const description = msg.text.replace("/image ", "").trim();

      try {
        const imageResponse = await axios.post("http://localhost:3000/openai/image", { description });
        const imageUrl = imageResponse.data.url;

        io.emit("message", {
          text: `<img src="${imageUrl}" alt="Imagem gerada pela OpenAI" style="max-width: 300px;">`,
          username: "OpenAI Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } catch (error) {
        console.error("Erro ao gerar imagem com a OpenAI: ", error);
        io.emit("message", {
          text: "Erro ao gerar imagem. Tente novamente mais tarde.",
          username: "OpenAI Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      }
    } else if (msg.text.startsWith("/gato")) {
      try {
        const catResponse = await axios.get("http://localhost:4000/cat");
        const catImageUrl = catResponse.data.url;

        io.emit("message", {
          text: `<img src="${catImageUrl}" alt="Imagem de Gato" style="max-width: 300px;">`,
          username: "API GATO",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } catch (error) {
        console.error("Erro ao buscar imagem de gato: ", error);
        io.emit("message", {
          text: "Erro ao buscar imagem de gato. Tente novamente mais tarde.",
          username: "API GATO",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      }
    } else if (msg.text.startsWith("/art")) {
      try {
        const artResponse = await axios.get("http://localhost:4000/artwork-image");
        const artworkUrl = artResponse.data.url;

        io.emit("message", {
          text: `<img src="${artworkUrl}" alt="Obra de arte" style="max-width: 300px;">`,
          username: "Art Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } catch (error) {
        console.error("Erro ao buscar imagem de obra de arte: ", error);
        io.emit("message", {
          text: "Erro ao buscar imagem de obra de arte. Tente novamente mais tarde.",
          username: "Art Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      }
    }else if (msg.text.startsWith("/dog")) {
      try {
        const dogImageResponse = await axios.get("http://localhost:4000/dog-image");
        const dogImageUrl = dogImageResponse.data.url;
    
        io.emit("message", {
          text: `<img src="${dogImageUrl}" alt="Imagem de Cachorro" style="max-width: 300px;">`,
          username: "Dog Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } catch (error) {
        console.error("Erro ao buscar imagem de cachorro: ", error);
        io.emit("message", {
          text: "Erro ao buscar imagem de cachorro. Tente novamente mais tarde.",
          username: "Dog Bot",
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

server.listen(4000, () => {
  console.log("Servidor rodando na porta 4000");
});