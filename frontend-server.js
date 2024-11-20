const express = require("express");
const path = require("path");
const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname))); // Serve arquivos do diretório atual

app.listen(port, () => {
  console.log(`Servidor frontend rodando na porta ${port}`);
});
