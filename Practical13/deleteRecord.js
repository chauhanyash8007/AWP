// mongoDeleteDemo.js

const { MongoClient } = require("mongodb");

// MongoDB URI (update if using MongoDB Atlas)
const uri = "mongodb://localhost:27017";

// Create a MongoDB client
const client = new MongoClient(uri);

// Main function
async function run() {
  try {
    // Connect to the database
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("test1DB");
    const collection = db.collection("users");

    // ---------- Step 1: Clean up collection ----------
    await collection.deleteMany({});
    console.log("🧹 Cleared existing documents from collection");

    // ---------- Step 2: Insert sample documents ----------
    const sampleDocs = [
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Smith", email: "jane@example.com" },
      { name: "John Doe", email: "john2@example.com" },
      { name: "Alice", email: "alice@example.com" },
    ];
    await collection.insertMany(sampleDocs);
    console.log("📥 Inserted sample documents");

    // ---------- Step 3: deleteOne ----------
    const queryOne = { name: "John Smith" };
    const docToDeleteOne = await collection.findOne(queryOne);

    if (docToDeleteOne) {
      console.log("🔍 deleteOne: Found document to delete:", docToDeleteOne);
      const deleteOneResult = await collection.deleteOne({
        _id: docToDeleteOne._id,
      });
      console.log(
        `🗑️ deleteOne: Deleted ${deleteOneResult.deletedCount} document`
      );
    } else {
      console.log("⚠️ deleteOne: No matching document found to delete");
    }

    // ---------- Step 4: deleteMany ----------
    const queryMany = { name: "John Doe" };
    const docsToDeleteMany = await collection.find(queryMany).toArray();

    if (docsToDeleteMany.length > 0) {
      console.log("🔍 deleteMany: Found documents to delete:");
      console.table(docsToDeleteMany);

      const deleteManyResult = await collection.deleteMany(queryMany);
      console.log(
        `🗑️ deleteMany: Deleted ${deleteManyResult.deletedCount} documents`
      );
    } else {
      console.log("⚠️ deleteMany: No more 'John Doe' documents found");
    }

    // ---------- Step 5: Show remaining documents ----------
    const remainingDocs = await collection.find({}).toArray();
    console.log("📂 Remaining Documents in Collection:");
    console.table(remainingDocs);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    // Close connection
    await client.close();
    console.log("🔌 MongoDB connection closed");
  }
}

// Run the script
run();
