const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: "10mb" }));

const api_key = "SG_2cc0755fe4f739e0";
const url = "https://api.segmind.com/v1/sd2.1-faceswapper";

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Serve assets files
app.use("/assets", express.static(path.join(__dirname, "../assets")));

app.post("/faceswap", async (req, res) => {
  try {
    console.log("Face swap request received"); // Log a simple message indicating a request was received

    const { sourceImg, targetImg } = req.body;

    const data = {
      input_face_image: sourceImg,
      target_face_image: targetImg,
      face_restore: "codeformer-v0.1.0.pth", // Adjust based on API requirements
      file_type: "jpg",
      base64: true,
    };

    const response = await axios.post(url, data, {
      headers: { "x-api-key": api_key },
    });

    console.log("Face swap successful"); // Log a concise message
    res.json(response.data);
  } catch (error) {
    console.error("Error swapping faces:", error.message); // Log the error message without details
    res.status(500).send("Error processing the request: " + error.message); // Send detailed error message in response
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});