const express = require("express");
const axios = require("axios");
const router = express.Router();

// Rota para buscar a imagem do gato
router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://api.thecatapi.com/v1/images/search", {
  headers: {
    "x-api-key": process.env.CAT_API_KEY,  // Use sua chave da API aqui
  },
});
    if (response.data && response.data[0] && response.data[0].url) {
      res.json({ url: response.data[0].url });
    } else {
      res.status(500).json({ error: "Resposta inesperada da API." });
    }
  } catch (error) {
    console.error("Erro ao buscar imagem de gato: ", error);
    res.status(500).json({ error: "Erro ao buscar imagem de gato." });
  }
});

module.exports = router;
