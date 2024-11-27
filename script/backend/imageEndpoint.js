const axios = require("axios");

module.exports = (app, io) => {
  app.post("/openai/image", async (req, res) => {
    const imageDescription = req.body.description;

    if (!imageDescription) {
      return res
        .status(400)
        .json({ error: "A descrição da imagem é obrigatória." });
    }

    try {
      io.emit("loading", { status: "loading" }); 

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

      io.emit("loading", { status: "completed" }); 
      res.json({ url: response.data.data[0].url });
    } catch (error) {
      io.emit("loading", { status: "error" });  
      console.error(
        "Erro ao gerar imagem:",
        error.response?.data || error.message
      );
      res.status(500).json({
        error: "Erro ao gerar imagem.",
        details: error.response?.data || "Sem detalhes adicionais.",
      });
    }
  });
};
