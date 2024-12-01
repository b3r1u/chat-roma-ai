const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (
      response.data &&
      response.data.choices &&
      response.data.choices[0].message
    ) {
      const openAIResponse = response.data.choices[0].message.content;
      return res.json({ response: openAIResponse });
    } else {
      return res.status(400).json({ error: "Resposta inesperada do OpenAI" });
    }
  } catch (error) {
    console.error("Erro ao conectar com o OpenAI:", error);
    return res.status(500).json({ error: "Erro interno ao chamar o OpenAI." });
  }
});

module.exports = router;
