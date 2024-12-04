import { login } from "../public/scripts/login.js";
import { handleMessage } from "../public/scripts/handleMessage.js";
import { handleCommand } from "../public/scripts/handleCommand.js";
import { showLoading, hideLoading } from "../public/scripts/loadingUtils.js";

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


document.getElementById("loginButton").addEventListener("click", () => {
  login(userColors)
  console.log(userColors)
});

username = localStorage.getItem('username');
profilePic = localStorage.getItem('profilePic');
userColor = userColors[username]?.color;

console.log("Nome do usuário:", username);
console.log("Imagem de perfil:", profilePic);
console.log("Cor do usuário:", userColor);
