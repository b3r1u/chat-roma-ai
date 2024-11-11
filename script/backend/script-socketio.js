const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
require('dotenv').config({ path: './script/token.env' }); 
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: "process.env.OPENAI_API_KEY"
});

const app = express();
const server = http.createServer(app);

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(__dirname + "/public"));
app.use(cors());

// Endpoint para gerar imagem
app.post("/openai/image", async (req, res) => {
  const imageDescription = req.body.description;

  try {
    io.emit("loading", { status: "loading" }); // Início do loading (Linha 33)

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

    io.emit("loading", { status: "completed" }); // Finaliza o loading com sucesso (Linha 44)
    res.json({ url: response.data.data[0].url });
  } catch (error) {
    io.emit("loading", { status: "error" }); // Finaliza o loading com erro (Linha 48)
    console.error("Erro ao gerar imagem: ", error);
    res.status(500).json({ error: "Erro ao gerar imagem" });
  }
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

//som do gato
app.get("/cat-sound", (req, res) => {
  const audioPath = path.join(__dirname, "public", "audios", "gato.mp3");
  res.sendFile(audioPath);
});

//som do scooby
app.get("/scooby-sound", (req, res) => {
  const audioPath = path.join(__dirname, "public", "audios", "scooby.mp3");
  res.sendFile(audioPath);
});

//som do cavalo
app.get("/cavalo-sound", (req, res) => {
  const audioPath = path.join(__dirname, "public", "audios", "cavalo.mp3");
  res.sendFile(audioPath);
});

//som do cachorro
app.get("/dog-sound", (req, res) => {
  const audioPath = path.join(__dirname, "public", "audios", "cachorro.mp3");
  res.sendFile(audioPath);
});

//som da galinha
app.get("/galinha-sound", (req, res) => {
  const audioPath = path.join(__dirname, "public", "audios", "galinha.mp3");
  res.sendFile(audioPath);
});

//som do spiderman
app.get("/spiderman-sound", (req, res) => {
  const audioPath = path.join(__dirname, "public", "audios", "spiderman.mp3");
  res.sendFile(audioPath);
});

//som do sapo
app.get("/sapo-sound", (req, res) => {
  const audioPath = path.join(__dirname, "public", "audios", "sapo.mp3");
  res.sendFile(audioPath);
});

//som do ari
app.get("/ari-sound", (req, res) => {
  const audioPath = path.join(__dirname, "public", "audios", "ari.mp3");
  res.sendFile(audioPath);
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

app.get("/fox-image", async (req, res) => {
  try {
    const response = await axios.get("https://randomfox.ca/floof/");
    const foxImageUrl = response.data.image;
    res.json({ url: foxImageUrl });
  } catch (error) {
    console.error("Erro ao buscar imagem de raposa: ", error);
    res.status(500).json({ error: "Erro ao buscar imagem de raposa" });
  }
});

app.post("/text", async (req, res) => {
  const { userMessage } = req.body;

  try {
    const openAiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    const aiResponseText = openAiResponse.choices[0].message.content;
    res.json({ text: aiResponseText });
  } catch (error) {
    console.error("Erro ao chamar a API da OpenAI: ", error);
    res
      .status(500)
      .json({
        error: "Erro ao se conectar à OpenAI. Tente novamente mais tarde.",
      });
  }
});


io.on("connection", (socket) => {
  console.log("Usuário conectado " + socket.id);
  socket.on("message", (data) => {
    const messageData = { ...data, id: socket.id };
    io.emit("message", messageData);
  });

  socket.on("message", async (msg) => {
  if (msg.text.startsWith("/text ")) {
    const userMessage = msg.text.replace("/text ", "").trim();

    try {
      const textResponse = await axios.post("http://localhost:3000/text", { userMessage });
      const aiResponseText = textResponse.data.text;

      io.emit("message", {
        text: aiResponseText,
        username: "OpenAI Bot",
        profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
        id: socket.id,
      });
    } catch (error) {
      console.error("Erro ao chamar o endpoint /text: ", error);
      io.emit("message", {
        text: "Erro ao se conectar ao endpoint /text. Tente novamente mais tarde.",
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
        const startTimestamp = Date.now();
    
        // Emite um evento para iniciar o carregamento
        io.emit("show-loading");
    
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(3000); // Simulação de tempo de espera

        const catResponse = await axios.get("http://localhost:4000/cat");
        const catImageUrl = catResponse.data.url;

        const endTimestamp = Date.now();
        const loadingTime = (endTimestamp - startTimestamp) / 1000;

        io.emit("hide-loading");

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
        const startTimestamp = Date.now();
    
        // Emite um evento para iniciar o carregamento
        io.emit("show-loading");
    
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(3000); // Simulação de tempo de espera
    
        const artResponse = await axios.get("http://localhost:4000/artwork-image");
        const artworkUrl = artResponse.data.url;
    
        const endTimestamp = Date.now();
        const loadingTime = (endTimestamp - startTimestamp) / 1000;
    
        io.emit("hide-loading");
    
        io.emit("message", {
          text: `
            <img src="${artworkUrl}" alt="Obra de arte" style="max-width: 300px;">
          `,
          username: "Art Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } catch (error) {
        console.error("Erro ao buscar imagem de obra de arte: ", error);
    
        // Emite um evento para remover o carregamento em caso de erro
        io.emit("hide-loading");
    
        // Emite a mensagem de erro
        io.emit("message", {
          text: "Erro ao buscar imagem de obra de arte. Tente novamente mais tarde.",
          username: "Art Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      }        
    } else if (msg.text.startsWith("/dog")) {
      try {
        const startTimestamp = Date.now();
    
        // Emite um evento para iniciar o carregamento
        io.emit("show-loading");
    
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(3000); // Simulação de tempo de espera

        const dogImageResponse = await axios.get("http://localhost:4000/dog-image");
        const dogImageUrl = dogImageResponse.data.url;

        const endTimestamp = Date.now();
        const loadingTime = (endTimestamp - startTimestamp) / 1000;

        io.emit("hide-loading");

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
    } else if (msg.text.startsWith("/fox")) {
      try {
        const startTimestamp = Date.now();
    
        // Emite um evento para iniciar o carregamento
        io.emit("show-loading");
    
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(3000); // Simulação de tempo de espera

        const foxImageResponse = await axios.get("http://localhost:4000/fox-image");
        const foxImageUrl = foxImageResponse.data.url;

        const endTimestamp = Date.now();
        const loadingTime = (endTimestamp - startTimestamp) / 1000;

        io.emit("hide-loading");

        io.emit("message", {
          text: `<img src="${foxImageUrl}" alt="Imagem de Raposa" style="max-width: 300px;">`,
          username: "Fox Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } catch (error) {
        console.error("Erro ao buscar imagem de raposa: ", error);
        io.emit("message", {
          text: "Erro ao buscar imagem de raposa. Tente novamente mais tarde.",
          username: "Fox Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      }
    } else if (msg.text.startsWith("/som do gato")) {
      try {
        const catSoundUrl = "http://localhost:4000/cat-sound";
        
        io.emit("message", {
          text: `<audio autoplay><source src="${catSoundUrl}" type="audio/mpeg"></audio>`,
          username: "Cat Sound Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } catch (error) {
        console.error("Erro ao reproduzir o som do gato: ", error);
        io.emit("message", {
          text: "Erro ao reproduzir o som do gato. Tente novamente mais tarde.",
          username: "Cat Sound Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      }
    } else if (msg.text.startsWith("/som do scooby")) {
      try {
        const catSoundUrl = "http://localhost:4000/scooby-sound";
        
        io.emit("message", {
          text: `<audio autoplay><source src="${catSoundUrl}" type="audio/mpeg"></audio>`,
          username: "scooby Sound Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } catch (error) {
        console.error("Erro ao reproduzir o som do scooby: ", error);
        io.emit("message", {
          text: "Erro ao reproduzir o som do scooby. Tente novamente mais tarde.",
          username: "scooby Sound Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      }
    } else if (msg.text.startsWith("/som do cachorro")) {
      try {
        const catSoundUrl = "http://localhost:4000/dog-sound";
        
        io.emit("message", {
          text: `<audio autoplay><source src="${catSoundUrl}" type="audio/mpeg"></audio>`,
          username: "Dog Sound Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } catch (error) {
        console.error("Erro ao reproduzir o som do cachorro: ", error);
        io.emit("message", {
          text: "Erro ao reproduzir o som do cachorro. Tente novamente mais tarde.",
          username: "Dog Sound Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      }
    } else if (msg.text.startsWith("/som do cavalo")) {
      try {
        const catSoundUrl = "http://localhost:4000/cavalo-sound";
        
        io.emit("message", {
          text: `<audio autoplay><source src="${catSoundUrl}" type="audio/mpeg"></audio>`,
          username: "cavalo Sound Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } catch (error) {
        console.error("Erro ao reproduzir o som do cavalo: ", error);
        io.emit("message", {
          text: "Erro ao reproduzir o som do cavalo. Tente novamente mais tarde.",
          username: "cavalo Sound Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      }
    } else if (msg.text.startsWith("/som do spiderman")) {
      try {
        const catSoundUrl = "http://localhost:4000/spiderman-sound";
        
        io.emit("message", {
          text: `<audio autoplay><source src="${catSoundUrl}" type="audio/mpeg"></audio>`,
          username: "spiderman Sound Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } catch (error) {
        console.error("Erro ao reproduzir o som do spiderman: ", error);
        io.emit("message", {
          text: "Erro ao reproduzir o som do scooby. Tente novamente mais tarde.",
          username: "spiderman Sound Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      }
    } else if (msg.text.startsWith("/som do galinha")) {
      try {
        const catSoundUrl = "http://localhost:4000/galinha-sound";
        
        io.emit("message", {
          text: `<audio autoplay><source src="${catSoundUrl}" type="audio/mpeg"></audio>`,
          username: "galinha Sound Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } catch (error) {
        console.error("Erro ao reproduzir o som do galinha: ", error);
        io.emit("message", {
          text: "Erro ao reproduzir o som do galinha. Tente novamente mais tarde.",
          username: "galinha Sound Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      }
    } else if (msg.text.startsWith("/som do sapo")) {
      try {
        const catSoundUrl = "http://localhost:4000/sapo-sound";
        
        io.emit("message", {
          text: `<audio autoplay><source src="${catSoundUrl}" type="audio/mpeg"></audio>`,
          username: "sapo Sound Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } catch (error) {
        console.error("Erro ao reproduzir o som do sapo: ", error);
        io.emit("message", {
          text: "Erro ao reproduzir o som do sapo. Tente novamente mais tarde.",
          username: "sapo Sound Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      }
    } else if (msg.text.startsWith("/som do ari")) {
      try {
        const catSoundUrl = "http://localhost:4000/ari-sound";
        
        io.emit("message", {
          text: `<audio autoplay><source src="${catSoundUrl}" type="audio/mpeg"></audio>`,
          username: "ooscby Sound Bot",
          profilePic: "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } catch (error) {
        console.error("Erro ao reproduzir o som do ari: ", error);
        io.emit("message", {
          text: "Erro ao reproduzir o som do ari. Tente novamente mais tarde.",
          username: "ari Sound Bot",
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
