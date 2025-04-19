const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const path = require("path");

const app = express();
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const dbName = "test1DB";
const collectionName = "users";

// Insert sample data (called once)
app.get("/init", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.deleteMany({});
    await collection.insertMany([
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Smith", email: "jane@example.com" },
      { name: "John Doe", email: "john2@example.com" },
      { name: "Alice", email: "alice@example.com" },
    ]);

    res.json({ message: "Sample data inserted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await client.close();
  }
});

// Get all documents
app.get("/documents", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const docs = await db.collection(collectionName).find().toArray();
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await client.close();
  }
});

// Delete one document
app.delete("/deleteOne/:id", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const result = await db
      .collection(collectionName)
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ deleted: result.deletedCount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await client.close();
  }
});

// Delete many by name
app.delete("/deleteMany/:name", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const result = await db
      .collection(collectionName)
      .deleteMany({ name: req.params.name });
    res.json({ deleted: result.deletedCount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await client.close();
  }
});

app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);
