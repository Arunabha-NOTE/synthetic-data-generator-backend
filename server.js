const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
import { Upload } from './constants.js';


// Replace with your MongoDB connection string


mongoose.connect(`${process.env.MONGODB_URI}/${Upload}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error(err));

const app = express();

// Configure middleware to parse JSON data
app.use(bodyParser.json());

// Define your Mongoose schema for the data you want to store from the JSON
const MyDataSchema = new mongoose.Schema({
  // Define your data fields here (e.g., name, email, etc.)
  field_name: { type: String, required: true },
  data_type: { type: String, required: true },
  Max_value: { type: Number }, // Assuming Max_value is a number
  Min_value: { type: Number }, // Assuming Min_value is a number
  Any_probabilistic_distributution: { type: String },
  Remarks: { type: String },
});

const MyDataModel = mongoose.model('MyData', MyDataSchema);

// Route for handling JSON upload using PUT request
app.put('/api/upload-json', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'No JSON data provided' });
    }

    const parsedData = req.body; // JSON data is already parsed
    const savedData = [];

    // Loop through each data object and save to MongoDB
    for (const row of parsedData) {
      const newData = new MyDataModel(row);

      await newData.save();
      savedData.push(newData);
    }

    res.status(201).json({ message: 'Data uploaded successfully', data: savedData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading data', error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
