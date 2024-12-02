const express = require("express");
const axios = require("axios");
const router = express.Router();

// Rota para buscar a imagem do cachorro
router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://dog.ceo/api/breeds/image/random");
    if (response.data && response.data.message) {
      res.json({ url: response.data.message });
    } else {
      res.status(500).json({ error: "Resposta inesperada da API." });
    }
  } catch (error) {
    console.error("Erro ao buscar imagem de cachorro: ", error);
    res.status(500).json({ error: "Erro ao buscar imagem de cachorro." });
  }
});

module.exports = router;
