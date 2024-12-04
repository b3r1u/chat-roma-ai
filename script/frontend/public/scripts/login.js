export function login(userColors) {
    const usernameInput = document.getElementById("username");
    const profilePicInput = document.getElementById("profilePic");
  
    usernameInput.classList.remove("input-error");
    usernameInput.placeholder = "Digite seu nome";
  
    if (usernameInput.value.trim()) {
      const username = usernameInput.value.trim();
      const userColor = userColors[username] || getRandomColor();
      userColors[username] = userColor;
  
      if (profilePicInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const profilePic = e.target.result;
          showChatScreen(profilePic);
        };
        reader.readAsDataURL(profilePicInput.files[0]);
      } else {
        const profilePic = "https://img.icons8.com/?size=100&id=11795&format=png&color=676767";
        showChatScreen(profilePic);
      }
    } else {
      usernameInput.classList.add("input-error");
      usernameInput.placeholder = "Campo obrigatório";
    }
  }
  
  function showChatScreen(profilePic) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("chatScreen").style.display = "block";
  }
  
  function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }
  