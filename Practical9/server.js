const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const archiver = require("archiver");
const unzipper = require("unzipper");

const app = express();
const PORT = 3000;

// Set up storage for uploaded files
const upload = multer({ dest: "uploads/" });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Route to serve the index.html file at the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route to handle file operations
app.post("/file/:action", upload.array("files"), async (req, res) => {
  const action = req.params.action;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).send("No files uploaded");
  }

  try {
    switch (action) {
      case "readSync":
        {
          let combinedContent = "";
          for (const file of files) {
            const content = fs.readFileSync(file.path, "utf8");
            combinedContent += `\n--- ${file.originalname} ---\n${content}\n`;
          }
          res.setHeader("Content-Type", "text/plain");
          res.send(combinedContent);
        }
        break;

      case "readAsync":
        {
          let combinedContent = "";
          for (const file of files) {
            const content = await fs.promises.readFile(file.path, "utf8");
            combinedContent += `\n--- ${file.originalname} ---\n${content}\n`;
          }
          res.setHeader("Content-Type", "text/plain");
          res.send(combinedContent);
        }
        break;

      case "compress":
        {
          const archive = archiver("zip", {
            zlib: { level: 9 }, // Maximum compression
          });

          res.setHeader("Content-Type", "application/zip");
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=compressed_files.zip"
          );

          archive.pipe(res);

          for (const file of files) {
            archive.file(file.path, { name: file.originalname });
          }

          await archive.finalize();
        }
        break;

      case "decompress":
        {
          const decompressedFiles = [];

          for (const file of files) {
            const fileExt = path.extname(file.originalname).toLowerCase();

            if (fileExt === ".gz") {
              const decompressedPath = path.join(
                "uploads",
                path.basename(file.originalname, ".gz")
              );
              const input = fs.createReadStream(file.path);
              const output = fs.createWriteStream(decompressedPath);
              const gunzip = zlib.createGunzip();

              await new Promise((resolve, reject) => {
                input
                  .pipe(gunzip)
                  .pipe(output)
                  .on("finish", resolve)
                  .on("error", reject);
              });

              decompressedFiles.push(decompressedPath);
            } else if (fileExt === ".zip") {
              await fs
                .createReadStream(file.path)
                .pipe(unzipper.Extract({ path: "uploads/" }))
                .promise();

              // Optionally, collect the list of extracted files
              // For simplicity, we're not tracking them here
            } else {
              return res
                .status(400)
                .send(`Unsupported file type: ${file.originalname}`);
            }
          }

          res.setHeader("Content-Type", "text/plain");
          res.send("Files decompressed successfully.");
        }
        break;

      default:
        res.status(400).send("Invalid action");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error processing files: ${err.message}`);
  } finally {
    // Clean up uploaded files
    for (const file of files) {
      fs.unlink(file.path, (err) => {
        if (err) console.error(`Error deleting file ${file.path}:`, err);
      });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
