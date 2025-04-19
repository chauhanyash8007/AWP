// app.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const PORT = 3000;

// Set storage engine
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Serve static files
app.use(express.static("public"));

// Upload endpoint
app.post("/upload", upload.single("myfile"), (req, res) => {
  if (!req.file) return res.send("No file uploaded.");
  res.send(`File uploaded successfully: <a href="/">Go Back</a>`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
