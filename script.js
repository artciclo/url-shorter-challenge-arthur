const longUrlInput = document.getElementById("longUrl");
const shortenButton = document.getElementById("shortenButton");
const resultDiv = document.getElementById("result");

shortenButton.addEventListener("click", async () => {
  const longUrl = longUrlInput.value;
  if (!longUrl) {
    resultDiv.textContent = "Por favor, insira uma URL.";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/shorten", {
      // URL completa aqui
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ longUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Tenta pegar a resposta em JSON em caso de erro
      resultDiv.textContent = `Erro: ${errorData.error || response.statusText}`; // Usa errorData.error ou response.statusText
      return;
    }

    const data = await response.json();
    resultDiv.innerHTML = `
      <p>URL encurtada:</p>
      <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>
    `;
  } catch (error) {
    resultDiv.textContent = `Erro: ${error}`;
  }
});
