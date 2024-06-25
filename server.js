const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Upload = "upload";

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${Upload}`, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
})();

const app = express();

// Use CORS middleware to allow all origins (adjust as needed)
app.use(cors());

// Configure middleware to parse JSON data
app.use(bodyParser.json());

// Define your Mongoose schema for the data you want to store from the JSON
const MyDataSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  field_name: { type: String, required: true },
  data_type: { type: String, required: true },
  max_value: { type: Number },
  min_value: { type: Number },
  any_probabilistic_distribution: { type: String },
  remarks: { type: String }
}, {collection: 'mydatas'});

const MyDataModel = mongoose.model('MyData', MyDataSchema);

// Route for handling JSON upload using POST request
app.post('/api/upload-json', async (req, res) => {
  try {
    if (!req.body || req.body.length === 0) {
      return res.status(400).json({ message: 'No JSON data provided' });
    }
    const parsedData = req.body; // JSON data is already parsed
    const savedData = await MyDataModel.insertMany(parsedData); // Use insertMany for array of data

    res.status(201).json({ message: 'Data uploaded successfully', data: savedData });
  } catch (err) {
    console.error('Error uploading data:', err);
    res.status(500).json({ message: 'Error uploading data', error: err.message });
  }
});

// Route for fetching all data from MongoDB
app.get('/api/data', async (req, res) => {
      try {
        const data = await MyDataModel.find(); // Fetch all data from the collection
        res.status(200).json({ message: 'Data fetched successfully', data });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ message: 'Error fetching data', error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
