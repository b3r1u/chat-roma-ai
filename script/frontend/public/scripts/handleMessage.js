export function handleMessage(data, socket, userColors) {
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
    console.log("nome ", data.username)
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
  