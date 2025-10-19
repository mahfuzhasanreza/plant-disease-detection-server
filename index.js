const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// db connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nz6fjje.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");

    // Initialize database and collections here when needed
    // const database = client.db("plantDiseaseDB");
    // const diseaseCollection = database.collection("diseases");

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");

  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.error("💡 Make sure your .env file exists with correct DB_USER and DB_PASS");
    process.exit(1);
  }
}

// Connect to MongoDB before starting the server
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Plant Disease Server is running! 🚀');
});

app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
});

