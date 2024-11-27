const axios = require("axios");

async function handleImageCommand(description, socket, io) {
  try {
    const imageResponse = await axios.post(
      "http://localhost:4000/openai/image",
      { description }
    );
    const imageUrl = imageResponse.data.url;

    io.emit("message", {
      text: `<img src="${imageUrl}" alt="Imagem gerada pela OpenAI" style="max-width: 300px;">`,
      username: "OpenAI Bot",
      profilePic:
        "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
      id: socket.id,
    });
  } catch (error) {
    console.error("Erro ao gerar imagem com a OpenAI: ", error);
    io.emit("message", {
      text: "Erro ao gerar imagem. Tente novamente mais tarde.",
      username: "OpenAI Bot",
      profilePic:
        "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
      id: socket.id,
    });
  }
}

module.exports = { handleImageCommand };
