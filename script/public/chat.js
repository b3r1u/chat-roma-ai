const socket = io("https://38e36f9b-66da-40e7-aa97-154dacdf0d0e-00-30acz2kkboipm.picard.replit.dev");
let username = "";
let profilePic = "";
let userColor = "";
const userColors = {};

socket.on("connect", () => {
  console.log("Conectado ao servidor");
});

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

socket.on("message", (data) => {
  const ul = document.querySelector("ul");
  const li = document.createElement("li");
  const img = document.createElement("img");

  if (data.profilePic) {
    img.src = data.profilePic;
  } else {
    img.src =
      "https://img.icons8.com/?size=100&id=11795&format=png&color=676767";
  }
  img.classList.add("profile-pic");

  if (data.id === socket.id) {
    li.classList.add("sent");
    li.style.flexDirection = "row-reverse";
  } else {
    li.classList.add("received");
    li.style.flexDirection = "row";
  }

  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container");

  const messageText = document.createElement("div");
  messageText.classList.add("message-text");

  const usernameColor = userColors[data.username] || getRandomColor();
  userColors[data.username] = usernameColor;
  messageText.innerHTML = `<strong style="color: ${usernameColor}">${data.username}</strong><br>${data.text}`;

  messageContainer.appendChild(messageText);
  li.appendChild(img);
  li.appendChild(messageContainer);
  ul.appendChild(li);

  ul.scrollTop = ul.scrollHeight;
});

function login() {
  const usernameInput = document.getElementById("username");
  const profilePicInput = document.getElementById("profilePic");
  const loginError = document.getElementById("loginError");

  usernameInput.classList.remove("input-error");
  usernameInput.placeholder = "Digite seu nome";

  if (usernameInput.value.trim()) {
    username = usernameInput.value.trim();
    usernameInput.classList.remove("input-error");

    if (!userColors[username]) {
      userColor = getRandomColor();
      userColors[username] = userColor;
    } else {
      userColor = userColors[username];
    }

    if (profilePicInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePic = e.target.result;
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("chatScreen").style.display = "block";
      };
      reader.readAsDataURL(profilePicInput.files[0]);
    } else {
      profilePic =
        "https://img.icons8.com/?size=100&id=11795&format=png&color=676767";
      document.getElementById("loginScreen").style.display = "none";
      document.getElementById("chatScreen").style.display = "block";
    }
  } else {
    usernameInput.classList.add("input-error");
    usernameInput.placeholder = "Campo obrigatório";
  }
}

function enviar() {
  let msg = document.getElementById("messageInput").value;
  const messageInput = document.getElementById("messageInput");

  messageInput.classList.remove("input-error");
  messageInput.placeholder = "Digite sua mensagem";

  if (msg.trim()) {
    socket.emit("message", {
      text: msg.trim(),
      username: username,
      profilePic: profilePic,
      userColor: userColor,
    });
    document.getElementById("messageInput").value = "";
    messageError.innerHTML = "";
    messageInput.classList.remove("input-error");
  } else {
    messageInput.classList.add("input-error");
    messageInput.placeholder = "Por favor, digite uma mensagem.";
  }
}

document
  .getElementById("messageInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      enviar();
    }
  });
