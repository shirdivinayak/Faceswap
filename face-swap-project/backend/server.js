const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: "10mb" }));

const api_key = "SG_6b9a0f63bc4adf1e";
const url = "https://api.segmind.com/v1/faceswap-v2";

// Function to convert image to base64
async function toB64(imgPath) {
  const data = fs.readFileSync(path.resolve(imgPath));
  return Buffer.from(data).toString("base64");
}

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Serve assets files
app.use("/assets", express.static(path.join(__dirname, "../assets")));

app.post("/faceswap", async (req, res) => {
  try {
    console.log("Face swap request received"); // Log a simple message indicating a request was received
    const { sourceImg, targetImg } = req.body;
    // Decode base64 data for source and target images
    const sourceImgBuffer = Buffer.from(sourceImg, "base64");
    const targetImgBuffer = Buffer.from(targetImg, "base64");

    // Write target image to a temporary file
    // const targetImgPath = path.join(__dirname, "temp", "target_img.jpg"); // Define your temporary directory here
    // fs.writeFileSync(targetImgPath, targetImgBuffer);

    // Perform face swap
    // const targetImgB64 = await toB64(targetImgPath);

    // Remove temporary file
    // fs.unlinkSync(targetImgPath);

    const data = {
      source_img: sourceImg,
      target_img: targetImg,
      face_restore: "codeformer-v0.1.0.pth",
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