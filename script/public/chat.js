const socket = io("http://127.0.0.1:3000");
let username = "";
let profilePic = "";

socket.on("connect", () => {
  console.log("Conectado ao servidor");
});

socket.on("message", (data) => {
  const ul = document.querySelector("ul");
  const li = document.createElement("li");
  const img = document.createElement("img");

  if (data.profilePic) {
    img.src = data.profilePic;
  } else {
    img.src = "https://img.icons8.com/ios/452/user-male.png";
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
  messageText.innerHTML = `<strong>${data.username}</strong><br>${data.text}`;

  messageContainer.appendChild(messageText);
  li.appendChild(img);
  li.appendChild(messageContainer);
  ul.appendChild(li);

  ul.scrollTop = ul.scrollHeight;
});

function login() {
  const usernameInput = document.getElementById("username");
  const profilePicInput = document.getElementById("profilePic");

  if (usernameInput.value) {
    username = usernameInput.value;

    if (profilePicInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePic = e.target.result;
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("chatScreen").style.display = "block";
      };
      reader.readAsDataURL(profilePicInput.files[0]);
    } else {
      profilePic = "https://img.icons8.com/ios/452/user-male.png";
      document.getElementById("loginScreen").style.display = "none";
      document.getElementById("chatScreen").style.display = "block";
    }
  } else {
    alert("Por favor, preencha o campo de Usuário.");
  }
}

function enviar() {
  let msg = document.getElementById("messageInput").value;
  if (msg.trim()) {
    socket.emit("message", {
      text: msg,
      username: username,
      profilePic: profilePic,
    });
    document.getElementById("messageInput").value = "";
  } else {
    alert("Por favor, digite uma mensagem antes de enviar.");
  }
}

// Permitir enviar mensagem ao pressionar Enter
document
  .getElementById("messageInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Previne o comportamento padrão de quebra de linha
      enviar(); // Envia a mensagem
    }
  });
