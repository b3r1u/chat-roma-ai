const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const response = await axios.get("https://api.artic.edu/api/v1/artworks?page=1&limit=100");
      const artworks = response.data.data;
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

module.exports = router;