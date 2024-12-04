export function showLoading() {
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
  
  export function hideLoading() {
    const loadingDiv = document.getElementById("loading-spinner");
    if (loadingDiv) loadingDiv.remove();
  }
  