const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Serve the HTML page to allow directory browsing
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>File Listing</title>
      </head>
      <body>
        <h1>Browse Directory</h1>
        <form action="/list" method="get">
          <label for="directory">Enter directory path:</label>
          <input type="text" id="directory" name="directory" required>
          <button type="submit">List Files</button>
        </form>
        <div id="file-list"></div>
      </body>
    </html>
  `);
});

// List files in the provided directory
app.get("/list", (req, res) => {
  const directoryPath = req.query.directory;

  if (!directoryPath) {
    return res.send("Please provide a directory path.");
  }

  // Resolve the directory path to prevent directory traversal attacks
  const resolvedPath = path.resolve(directoryPath);

  // Check if the directory exists
  fs.readdir(resolvedPath, (err, files) => {
    if (err) {
      return res.send(
        "Error reading the directory. Please make sure the path is correct."
      );
    }

    let fileListHtml = "<h2>Files:</h2><ul>";
    files.forEach((file) => {
      fileListHtml += `<li>${file}</li>`;
    });
    fileListHtml += "</ul>";
    res.send(fileListHtml);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
