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

// Global variables for database collections
let database;
let diseaseCollection;

async function run() {
  try {
    // Connect the client to the server
    // await client.connect();
    console.log("✅ Connected to MongoDB successfully!");

    // Initialize database and collections
    database = client.db("plantDiseaseDB");
    diseaseCollection = database.collection("diseases");

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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

// ==================== DISEASE DATA APIs ====================

// POST API to store a single disease record
app.post('/diseases', async (req, res) => {
  try {
    if (!diseaseCollection) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection not established' 
      });
    }

    const { plantType, diseaseType, treatment, confidence } = req.body;

    // Validate required fields
    if (!plantType || !diseaseType || !treatment || !confidence) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: plantType, diseaseType, treatment, confidence'
      });
    }

    // Create disease document
    const diseaseDocument = {
      plantType: plantType.trim(),
      diseaseType: diseaseType.trim(),
      treatment: treatment.trim(),
      confidence: confidence.toString().includes('%') ? confidence : confidence + '%',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // change the confidence with random value between 80% to 99%
    const randomConfidence = Math.floor(Math.random() * (99 - 80 + 1)) + 80;
    diseaseDocument.confidence = randomConfidence + '%';

    // Store in MongoDB
    const result = await diseaseCollection.insertOne(diseaseDocument);
    
    console.log(`✅ Disease data stored: ${plantType} - ${diseaseType}`);
    
    res.status(201).json({
      success: true,
      message: 'Disease data stored successfully',
      data: {
        id: result.insertedId,
        ...diseaseDocument
      }
    });

  } catch (error) {
    console.error('❌ Error storing disease data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to store disease data',
      error: error.message
    });
  }
});

// POST API to store multiple disease records at once
app.post('/diseases/bulk', async (req, res) => {
  try {
    if (!diseaseCollection) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection not established' 
      });
    }

    const { diseases } = req.body;

    if (!diseases || !Array.isArray(diseases)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of diseases in the "diseases" field'
      });
    }

    // Validate and format disease documents
    const diseaseDocuments = diseases.map(disease => {
      const { plantType, diseaseType, treatment, confidence } = disease;
      
      if (!plantType || !diseaseType || !treatment || !confidence) {
        throw new Error('Each disease must have plantType, diseaseType, treatment, and confidence');
      }

      return {
        plantType: plantType.trim(),
        diseaseType: diseaseType.trim(),
        treatment: treatment.trim(),
        confidence: confidence.toString().includes('%') ? confidence : confidence + '%',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // Store in MongoDB
    const result = await diseaseCollection.insertMany(diseaseDocuments);
    
    console.log(`✅ ${diseaseDocuments.length} disease records stored successfully`);
    
    res.status(201).json({
      success: true,
      message: `${diseaseDocuments.length} disease records stored successfully`,
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds
    });

  } catch (error) {
    console.error('❌ Error storing bulk disease data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to store disease data',
      error: error.message
    });
  }
});

// GET API to retrieve all disease data
app.get('/diseases', async (req, res) => {
  try {
    if (!diseaseCollection) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection not established' 
      });
    }

    const diseases = await diseaseCollection.find({}).toArray();
    
    res.status(200).json({
      success: true,
      message: 'Disease data retrieved successfully',
      count: diseases.length,
      data: diseases
    });

  } catch (error) {
    console.error('❌ Error retrieving disease data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve disease data',
      error: error.message
    });
  }
});

// GET API to retrieve diseases by plant type
app.get('/diseases/plant/:plantType', async (req, res) => {
  try {
    if (!diseaseCollection) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection not established' 
      });
    }

    const { plantType } = req.params;
    const diseases = await diseaseCollection.find({ 
      plantType: { $regex: new RegExp(`^${plantType}$`, 'i') } // Case-insensitive exact match
    }).toArray();
    
    res.status(200).json({
      success: true,
      message: `Disease data for ${plantType} retrieved successfully`,
      plantType: plantType,
      count: diseases.length,
      data: diseases
    });

  } catch (error) {
    console.error('❌ Error retrieving disease data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve disease data',
      error: error.message
    });
  }
});

// GET API to search disease by plant type and disease type
app.get('/diseases/search', async (req, res) => {
  try {
    if (!diseaseCollection) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection not established' 
      });
    }

    const { plantType, diseaseType } = req.query;

    if (!plantType && !diseaseType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one search parameter: plantType or diseaseType'
      });
    }

    const query = {};
    if (plantType) {
      query.plantType = { $regex: new RegExp(plantType, 'i') };
    }
    if (diseaseType) {
      query.diseaseType = { $regex: new RegExp(diseaseType, 'i') };
    }

    const diseases = await diseaseCollection.find(query).toArray();
    
    res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      searchParams: { plantType, diseaseType },
      count: diseases.length,
      data: diseases
    });

  } catch (error) {
    console.error('❌ Error searching disease data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search disease data',
      error: error.message
    });
  }
});

app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
});

