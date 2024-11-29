const express = require("express");
const path = require("path");
const router = express.Router();

const sounds = {
  "cat-sound": "gato.mp3",
  "scooby-sound": "scooby.mp3",
  "cavalo-sound": "cavalo.mp3",
  "dog-sound": "cachorro.mp3",
  "galinha-sound": "galinha.mp3",
  "spiderman-sound": "spiderman.mp3",
  "sapo-sound": "sapo.mp3",
  "ari-sound": "ari.mp3",
};

Object.keys(sounds).forEach((route) => {
  router.get(`/${route}`, (req, res) => {
    const audioPath = path.join(
      __dirname,
      "..",
      "frontend",
      "public",
      "audios",
      sounds[route]
    );
    res.sendFile(audioPath);
  });
});

module.exports = router;
