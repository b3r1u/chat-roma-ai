export function sendMessageToOpenAI(socket, userMessage, showLoading, hideLoading) {
    showLoading();
  
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
          });
        } else {
          console.error("Resposta do OpenAI não contém dados válidos");
        }
      })
      .catch((error) => {
        console.error("Erro ao enviar para OpenAI:", error);
      })
      .finally(() => {
        hideLoading();
      });
  }
  