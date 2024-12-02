const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const response = await axios.get("https://randomfox.ca/floof/");
      const foxImageUrl = response.data.image;
      res.json({ url: foxImageUrl });
    } catch (error) {
      console.error("Erro ao buscar imagem de raposa: ", error);
      res.status(500).json({ error: "Erro ao buscar imagem de raposa" });
    }
  });

module.exports = router;