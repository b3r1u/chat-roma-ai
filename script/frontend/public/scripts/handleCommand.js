import { sendMessageToOpenAI } from "./sendMessageToOpenAI.js";
import { sendImageRequest } from "./sendImageRequest.js";
import { fetchDogImage } from "./fetchDogImage.js";
import { fetchCatImage } from "./fetchCatImage.js";
import { fetchArtImage } from "./fetchArtImage.js";
import { fetchFoxImage } from "./fetchFoxImage.js";

// Função para tocar o som
function playSound(soundName) {
  const audioPath = `audios/${soundName}.mp3`;
  const audio = new Audio(audioPath);
  audio.play().catch((error) => {
    console.error("Erro ao reproduzir o som:", error);
  });
}

export function handleCommand(message, socket, showLoading, hideLoading, userColors) {
  // Comando "/som" para tocar um som
  if (message.startsWith("/som")) {
    const parts = message.split(" ");
    const soundName = parts[1]; // O segundo item na divisão

    if (soundName) {
      playSound(soundName);
    } else {
      console.warn("Comando de som inválido. Por favor, forneça o nome do som.");
    }
    return true;
  }

  // Comando "/text" para enviar uma mensagem ao OpenAI
  if (message.startsWith("/text")) {
    const userMessage = message.replace("/text ", "");
    sendMessageToOpenAI(socket, userMessage, showLoading, hideLoading);
    return true;
  }

  // Comando "/image" para enviar uma requisição de imagem ao servidor
  if (message.startsWith("/image")) {
    const imageDescription = message.replace("/image ", "");
    sendImageRequest(socket, imageDescription, showLoading, hideLoading);
    return true;
  }

  // Comando "/dog" para obter imagem de cachorro
  if (message === "/dog") {
    fetchDogImage(socket, showLoading, hideLoading);
    return true;
  }

  // Comando "/cat" para obter imagem de gato
  if (message === "/cat") {
    fetchCatImage(socket, showLoading, hideLoading);
    return true;
  }

  // Comando "/art" para obter imagem de arte
  if (message === "/art") {
    fetchArtImage(socket, showLoading, hideLoading);
    return true;
  }

  // Comando "/fox" para obter imagem de rapousa
  if (message === "/fox") {
    fetchFoxImage(socket, showLoading, hideLoading);
    return true;
  }

  return false;
}
