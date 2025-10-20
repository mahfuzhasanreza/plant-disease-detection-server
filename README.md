# 🌱 Plant Disease Detection Server

A RESTful API server for managing plant disease detection data, built with Express.js and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Sample Data](#sample-data)
- [Deployment](#deployment)
- [Author](#author)

## ✨ Features

- 🔍 Store and retrieve plant disease information
- 🌾 Support for multiple plant types (Tomato, Potato, etc.)
- 💊 Treatment recommendations for various diseases
- 🎯 Confidence level tracking for disease detection
- 📊 Bulk data import support
- 🔎 Advanced search and filtering capabilities
- 🚀 Ready for Vercel deployment

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB instance)

## 📥 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd plant-disease-detection-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
touch .env
```

## 🔐 Environment Variables

Add the following variables to your `.env` file:

```env
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
PORT=5000
```

Replace `your_mongodb_username` and `your_mongodb_password` with your actual MongoDB Atlas credentials.

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## 📡 API Endpoints

### Base URL
```
http://localhost:5000
```

### 1. Health Check
**GET** `/`

Returns server status.

**Response:**
```json
"Plant Disease Server is running! 🚀"
```

---

### 2. Store Single Disease Record
**POST** `/diseases`

Store a single disease detection result.

**Request Body:**
```json
{
  "plantType": "Tomato",
  "diseaseType": "Early Blight",
  "treatment": "Apply fungicide spray. Remove affected leaves.",
  "confidence": "87%"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Disease data stored successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "plantType": "Tomato",
    "diseaseType": "Early Blight",
    "treatment": "Apply fungicide spray. Remove affected leaves.",
    "confidence": "92%",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Note:** Confidence is automatically randomized between 80-99% for testing purposes.

---

### 3. Bulk Insert Disease Records
**POST** `/diseases/bulk`

Store multiple disease records at once.

**Request Body:**
```json
{
  "diseases": [
    {
      "plantType": "Tomato",
      "diseaseType": "Healthy",
      "treatment": "Plant looks healthy!",
      "confidence": "95%"
    },
    {
      "plantType": "Potato",
      "diseaseType": "Late Blight",
      "treatment": "Critical: Remove infected areas.",
      "confidence": "89%"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "2 disease records stored successfully",
  "insertedCount": 2,
  "insertedIds": {
    "0": "507f1f77bcf86cd799439011",
    "1": "507f1f77bcf86cd799439012"
  }
}
```

---

### 4. Get All Diseases
**GET** `/diseases`

Retrieve all disease records from the database.

**Response:**
```json
{
  "success": true,
  "message": "Disease data retrieved successfully",
  "count": 9,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "plantType": "Tomato",
      "diseaseType": "Early Blight",
      "treatment": "Apply fungicide spray...",
      "confidence": "87%",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 5. Get Diseases by Plant Type
**GET** `/diseases/plant/:plantType`

Retrieve all diseases for a specific plant type.

**Example:**
```
GET /diseases/plant/Tomato
```

**Response:**
```json
{
  "success": true,
  "message": "Disease data for Tomato retrieved successfully",
  "plantType": "Tomato",
  "count": 6,
  "data": [...]
}
```

---

### 6. Search Diseases
**GET** `/diseases/search?plantType=<plantType>&diseaseType=<diseaseType>`

Search diseases by plant type and/or disease type (case-insensitive partial match).

**Example:**
```
GET /diseases/search?plantType=Tomato&diseaseType=Blight
```

**Response:**
```json
{
  "success": true,
  "message": "Search completed successfully",
  "searchParams": {
    "plantType": "Tomato",
    "diseaseType": "Blight"
  },
  "count": 2,
  "data": [...]
}
```

## 📦 Sample Data

You can use the data from [test-data.json](test-data.json) to populate your database. Send a POST request to `/diseases/bulk` with the contents of this file.

**Example using cURL:**
```bash
curl -X POST http://localhost:5000/diseases/bulk \
  -H "Content-Type: application/json" \
  -d @test-data.json
```

## 🌐 Deployment

This project is configured for deployment on [Vercel](https://vercel.com/).

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `DB_USER`
   - `DB_PASS`

The [vercel.json](vercel.json) configuration file is already set up for automatic deployment.

## 📝 Project Structure

```
plant-disease-detection-server/
├── index.js              # Main server file
├── package.json          # Dependencies and scripts
├── vercel.json          # Vercel deployment config
├── test-data.json       # Sample disease data
├── .env                 # Environment variables (not tracked)
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🧪 Testing the API

You can test the API using:
- **Postman**: Import the endpoints and test
- **cURL**: Use command-line requests
- **Thunder Client** (VS Code extension)

## 📄 License

ISC

## 👨‍💻 Author

**Mahfuz Hasan Reza**

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!