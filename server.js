const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// ... (previous code)

app.post('/api/upload-json', bodyParser.json(), async (req, res) => {
  try {
    const data = req.body; // Access uploaded JSON data from request body

    // Validate data (optional)
    // You can add validation logic here to ensure the uploaded data
    // conforms to your expected schema

    const jsonData = new JsonData(data); // Create new mongoose document
    await jsonData.save(); // Save data to MongoDB

    res.status(201).json({ message: 'Data uploaded successfully!' });
  } catch (error) {
    console.error('Error uploading data:', error);
    res.status(500).json({ message: 'Error uploading data' }); // Handle errors
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
