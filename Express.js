const express = require("express");
const app = express();
const shortid = require("shortid");
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // Para analisar o corpo JSON das requisições

app.post("/api/shorten", async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) return res.status(400).json({ error: "URL is required" });

  try {
    let url = await Url.findOne({ longUrl });
    if (url)
      return res.json({
        key: url.shortCode,
        longUrl: url.longUrl,
        shortUrl: `http://seu-dominio/${url.shortCode}`,
      });

    const shortCode = shortid.generate();
    url = new Url({ longUrl, shortCode });
    await url.save();
    res.json({
      key: shortCode,
      longUrl,
      shortUrl: `http://seu-dominio/${shortCode}`,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Erro de chave duplicada
      // Lidar com a duplicidade, talvez gerando um novo shortCode
      console.error("Short code collision:", error);
      res.status(500).json({ error: "Error generating short code" });
    } else {
      console.error("Database error:", error);
      res.status(500).json({ error: "Database error" });
    }
  }
});
