const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "test1DB";
const collectionName = "users";

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

app.get("/select/:id", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const doc = await db
      .collection(collectionName)
      .findOne({ _id: new ObjectId(req.params.id) });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await client.close();
  }
});

app.put("/update/:id", async (req, res) => {
  const { name, email } = req.body;
  try {
    await client.connect();
    const db = client.db(dbName);
    const result = await db
      .collection(collectionName)
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { name, email } }
      );
    res.json({ updated: result.modifiedCount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await client.close();
  }
});

app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);
