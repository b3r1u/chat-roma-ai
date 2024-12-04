export function sendImageRequest(socket, imageDescription, showLoading, hideLoading) {
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
  