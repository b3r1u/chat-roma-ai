export function fetchArtImage(socket, showLoading, hideLoading) {
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
          });
        } else {
          console.error("Resposta do servidor não contém URL de imagem.");
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar imagem de arte:", error);
      })
      .finally(() => {
        hideLoading();
      });
  }
  