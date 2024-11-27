const axios = require("axios");

async function getCatImage() {
  try {
    const response = await axios.get(
      "https://api.thecatapi.com/v1/images/search"
    );
    const catImageUrl = response.data[0].url;
    return { success: true, url: catImageUrl };
  } catch (error) {
    console.error("Erro ao buscar imagem de gato: ", error);
    return { success: false, error: "Erro ao buscar imagem de gato" };
  }
}

module.exports = { getCatImage };
