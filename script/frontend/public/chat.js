import { login } from "../public/scripts/login.js";
import { handleMessage } from "../public/scripts/handleMessage.js";
import { handleCommand } from "../public/scripts/handleCommand.js";

const socket = io("http://127.0.0.1:4000");
let username = "";
let profilePic = "";
let userColor = "";
const userColors = {};

const enviarBtn = document.getElementById("enviarBtn");
const messageInput = document.getElementById("messageInput");

enviarBtn.addEventListener("click", enviar);

messageInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    enviar();
  }
});

socket.on("connect", () => {
  console.log("Conectado ao servidor com ID:", socket.id);

  socket.off("message");
  socket.on("message", (data) => handleMessage(data, socket, userColors));
});

function enviar() {
  let msg = messageInput.value;

  messageInput.classList.remove("input-error");
  messageInput.placeholder = "Digite sua mensagem";

  if (msg.trim()) {
    if (!handleCommand(msg.trim(), socket, showLoading, hideLoading, userColors)) {
      socket.emit("message", {
        text: msg.trim(),
        username: username,
        profilePic: profilePic,
        userColor: userColor,
        id: socket.id,
      });
    }
    messageInput.value = "";
  } else {
    messageInput.classList.add("input-error");
    messageInput.placeholder = "Por favor, digite uma mensagem.";
  }
}

document.getElementById("loginButton").addEventListener("click", () => login(userColors));

function showLoading() {
  const ul = document.querySelector("ul");
  if (!document.getElementById("loading-spinner")) {
    const li = document.createElement("li");
    li.id = "loading-spinner";
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.innerHTML = `
      <div style="display: flex; align-items: center; margin-left: 17.7rem;">
        <div class="spinner" style="width: 30px; height: 30px; border: 4px solid #ccc; border-top-color: #676767; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <span style="margin-left: 10px; color: #FFFFFF;">Carregando imagem...</span>
      </div>`;
    ul.appendChild(li);
    ul.scrollTop = ul.scrollHeight;
  }
}

function hideLoading() {
  const loadingDiv = document.getElementById("loading-spinner");
  if (loadingDiv) loadingDiv.remove();
}