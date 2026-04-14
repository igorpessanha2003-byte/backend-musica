const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const app = express();
const upload = multer({ dest: "uploads/" });

const API_KEY = "0d69f94c0586b94fe1cec295d0f9d333"

app.post("/recognize", upload.single("audio"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    formData.append("api_token", API_KEY);
    formData.append("return", "spotify");

    const response = await axios.post("https://api.audd.io/", formData, {
      headers: formData.getHeaders(),
    });

    const result = response.data.result;

    res.json({
      title: result?.title || "Desconhecida",
      artist: result?.artist || "Desconhecido",
    });

  } catch (error) {
    res.status(500).json({ error: "Erro ao reconhecer música" });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});