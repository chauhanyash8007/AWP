// server.js

const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve static files

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "TestDB";
const collectionName = "users";

let db, usersCollection;

client
  .connect()
  .then(() => {
    db = client.db(dbName);
    usersCollection = db.collection(collectionName);
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

app.post("/users", async (req, res) => {
  try {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.status(201).send({ message: "User inserted", id: result.insertedId });
  } catch (err) {
    res.status(500).send({ error: "Failed to insert user" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await usersCollection.find().toArray();
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
