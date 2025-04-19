const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "LibraryDB";
const collectionName = "Books";

// Seed with initial books (only for testing)
app.get("/seed", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    await db.collection(collectionName).deleteMany({});
    await db.collection(collectionName).insertMany([
      { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
      { title: "1984", author: "George Orwell" },
      { title: "To Kill a Mockingbird", author: "Harper Lee" },
    ]);
    res.send("Sample books added.");
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
});

// Get all books
app.get("/books", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const books = await db.collection(collectionName).find().toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
});

// Add new book
app.post("/add-book", async (req, res) => {
  const { title, author } = req.body;
  try {
    await client.connect();
    const db = client.db(dbName);
    await db.collection(collectionName).insertOne({ title, author });
    res.json({ message: "Book added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
});

// Search for a book
app.get("/search", async (req, res) => {
  const { title } = req.query;
  try {
    await client.connect();
    const db = client.db(dbName);
    const book = await db
      .collection(collectionName)
      .findOne({ title: { $regex: new RegExp(title, "i") } });
    res.json({ found: !!book, book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
});

app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);
