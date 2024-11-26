const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const shortid = require("shortid");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(
  cors({ origin: "http://localhost:8080", methods: ["GET", "POST", "DELETE"] })
); // Permite apenas de 8080

mongoose
  .connect("mongodb://localhost:27017/encurtador", {})
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
});

const Url = mongoose.model("Url", urlSchema);

app.post("/api/shorten", async (req, res) => {
  const longUrl = req.body.longUrl;
  if (!longUrl) return res.status(400).json({ error: "Long URL is required" });

  try {
    const shortCode = shortid.generate();
    const newUrl = new Url({ longUrl, shortCode });
    await newUrl.save();
    res.json({
      key: shortCode,
      longUrl,
      shortUrl: `http://localhost:3000/api/${shortCode}`,
    });
  } catch (error) {
    console.error("Erro ao encurtar URL:", error);
    res.status(500).json({ error: "Erro ao encurtar URL" });
  }
});

app.get("/api/:shortCode", async (req, res) => {
  const shortCode = req.params.shortCode;
  try {
    const url = await Url.findOne({ shortCode });
    if (!url) return res.status(404).send("URL not found");
    return res.redirect(302, url.longUrl);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send("Database error");
  }
});

app.delete("/api/:shortCode", async (req, res) => {
  const shortCode = req.params.shortCode;
  try {
    const result = await Url.deleteOne({ shortCode });
    if (result.deletedCount === 0) return res.status(404).send("URL not found");
    res.send("URL deleted successfully");
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send("Database error");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Servidor principal rodando na porta ${port}`)
);
