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
  socket.on("message", handleMessage);
});

function handleCommand(message) {
  if (message.startsWith("/som")) {
    const soundName = message.split(" ")[2];
    if (soundName) {
      playSound(soundName);
    } else {
      console.warn("Comando de som inválido.");
    }
    return true;
  }

  if (message.startsWith("/text")) {
    const userMessage = message.replace("/text ", ""); 
    sendMessageToOpenAI(userMessage);
    return true;
  }

  if (message.startsWith("/image")) {
    const imageDescription = message.replace("/image ", ""); 
    sendImageRequest(imageDescription);
    return true;
  }
  if (message === "/dog") { // comando para imagem do cachorro
    fetchDogImage();
    return true;
  }

  if (message === "/cat") { // comando para imagem do gato
    fetchCatImage();
    return true;
  }

  if (message === "/art") { // comando para imagem de art
    fetchArtImage();
    return true;
  }

  if (message === "/fox") { // comando para imagem de art
    fetchFoxImage();
    return true;
  }
  return false;
}

function sendImageRequest(imageDescription) {
  showLoading();

  fetch("http://localhost:4000/openai/image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description: imageDescription }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Falha na requisição ao servidor para gerar imagem");
      }
      return response.json();
    })
    .then((data) => {
      if (data.url) {
        socket.emit("message", {
          text: `<img src="${data.url}" alt="Generated Image" style="max-width: 100%; height: auto;" />`,
          username: "OpenAI",
          profilePic:
            "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } else {
        console.error("Resposta do servidor não contém URL de imagem.");
      }
    })
    .catch((error) => {
      console.error("Erro ao gerar imagem:", error);
    })
    .finally(() => {
      hideLoading();
    });
}

function sendMessageToOpenAI(userMessage) {
  fetch("http://localhost:4000/openai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userMessage }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Falha na requisição ao servidor OpenAI");
      }
      return response.json();
    })
    .then((data) => {
      if (data.response) {
        socket.emit("message", {
          text: data.response,
          username: "OpenIA",
          profilePic:
            "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } else {
        console.error("Resposta do OpenAI não contém dados válidos");
      }
    })
    .catch((error) => {
      console.error("Erro ao enviar para OpenAI:", error);
    });
}

function fetchDogImage() {
  showLoading();

  fetch("http://localhost:4000/dog-image")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Falha na requisição ao servidor para buscar imagem do cachorro");
      }
      return response.json();
    })
    .then((data) => {
      if (data.url) {
        socket.emit("message", {
          text: `<img src="${data.url}" alt="Dog Image" style="max-width: 100%; height: auto;" />`,
          username: "Dog API",
          profilePic:
            "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } else {
        console.error("Resposta do servidor não contém URL de imagem.");
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar imagem do cachorro:", error);
    })
    .finally(() => {
      hideLoading();
    });
}

function fetchCatImage() {
  showLoading();

  fetch("http://localhost:4000/cat-image")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Falha na requisição ao servidor para buscar imagem do gato");
      }
      return response.json();
    })
    .then((data) => {
      if (data.url) {
        socket.emit("message", {
          text: `<img src="${data.url}" alt="Cat Image" style="max-width: 100%; height: auto;" />`,
          username: "Cat API",
          profilePic:
            "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } else {
        console.error("Resposta do servidor não contém URL de imagem.");
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar imagem do gato:", error);
    })
    .finally(() => {
      hideLoading();
    });
}

function fetchArtImage() {
  showLoading();

  fetch("http://localhost:4000/artwork-image")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Falha na requisição ao servidor para buscar imagem de arte");
      }
      return response.json();
    })
    .then((data) => {
      if (data.url) {
        socket.emit("message", {
          text: `<img src="${data.url}" alt="Art Image" style="max-width: 100%; height: auto;" />`,
          username: "Art API",
          profilePic:
            "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } else {
        console.error("Resposta do servidor não contém URL de imagem.");
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar imagem de art", error);
    })
    .finally(() => {
      hideLoading();
    });
}

function fetchFoxImage() {
  showLoading();

  fetch("http://localhost:4000/fox-image")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Falha na requisição ao servidor para buscar imagem de rapousa");
      }
      return response.json();
    })
    .then((data) => {
      if (data.url) {
        socket.emit("message", {
          text: `<img src="${data.url}" alt="Art Image" style="max-width: 100%; height: auto;" />`,
          username: "Fox API",
          profilePic:
            "https://img.icons8.com/?size=100&id=11795&format=png&color=676767",
          id: socket.id,
        });
      } else {
        console.error("Resposta do servidor não contém URL de imagem.");
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar imagem de rapousa", error);
    })
    .finally(() => {
      hideLoading();
    });
}

function playSound(soundName) {
  const audioPath = `audios/${soundName}.mp3`;
  const audio = new Audio(audioPath);
  audio.play().catch((error) => {
    console.error("Erro ao reproduzir o som:", error);
  });
}

function enviar() {
  let msg = messageInput.value;

  messageInput.classList.remove("input-error");
  messageInput.placeholder = "Digite sua mensagem";

  if (msg.trim()) {
    if (!handleCommand(msg.trim())) {
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

function handleMessage(data) {
  console.log("Recebendo mensagem com ID:", data.id);

  const ul = document.querySelector("ul");
  const li = document.createElement("li");
  const img = document.createElement("img");

  img.src =
    data.profilePic ||
    "https://img.icons8.com/?size=100&id=11795&format=png&color=676767";
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
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function login() {
  const usernameInput = document.getElementById("username");
  const profilePicInput = document.getElementById("profilePic");

  usernameInput.classList.remove("input-error");
  usernameInput.placeholder = "Digite seu nome";

  if (usernameInput.value.trim()) {
    username = usernameInput.value.trim();
    userColor = userColors[username] || getRandomColor();
    userColors[username] = userColor;

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
