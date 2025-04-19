const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const baseDir = path.join(__dirname, "uploads");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Ensure uploads directory exists
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);

// Home Page with UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Create new file
app.post("/create", (req, res) => {
  const filename = req.body.filename;
  const fullPath = path.join(baseDir, filename);

  fs.writeFile(fullPath, "", (err) => {
    if (err) return res.send("Error creating file");
    res.send(`File '${filename}' created successfully`);
  });
});

// Rename file
app.post("/rename", (req, res) => {
  const oldName = req.body.oldname;
  const newName = req.body.newname;

  const oldPath = path.join(baseDir, oldName);
  const newPath = path.join(baseDir, newName);

  fs.rename(oldPath, newPath, (err) => {
    if (err) return res.send("Error renaming file");
    res.send(`File renamed from '${oldName}' to '${newName}'`);
  });
});

// List current files
app.get("/files", (req, res) => {
  fs.readdir(baseDir, (err, files) => {
    if (err) return res.send("Error reading files");
    res.json(files);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
