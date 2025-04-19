const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const cors = require("cors");
app.use(cors());

app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Create a new file in uploads
app.post("/create", (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).send("Filename is required");

  const filePath = path.join(uploadsDir, filename);

  fs.writeFile(filePath, "", "utf8", (err) => {
    if (err) return res.status(500).send("Error creating file");
    res.send(`File '${filename}' created in uploads folder`);
  });
});

// Read a file from uploads
app.get("/read/:filename", (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);

  if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    res.send(data);
  });
});

// Write (overwrite) a file in uploads
app.put("/write", (req, res) => {
  const { filename, content } = req.body;
  if (!filename) return res.status(400).send("Filename is required");

  const filePath = path.join(uploadsDir, filename);

  fs.writeFile(filePath, content || "", "utf8", (err) => {
    if (err) return res.status(500).send("Error writing to file");
    res.send(`Content written to '${filename}'`);
  });
});

// Delete a file from uploads
app.delete("/delete/:filename", (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);

  if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).send("Error deleting file");
    res.send(`File '${req.params.filename}' deleted`);
  });
});

// Optional: List all files in uploads folder
app.get("/list", (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return res.status(500).send("Error listing files");
    res.json(files);
  });
});

// Download file from uploads
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send("File not found");
  }
});

app.listen(PORT, () => {
  console.log(`File Manager API is running at http://localhost:${PORT}`);
});
