const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const uri = "mongodb+srv://cedesjohn56:Minecraft5656@cluster0.dkrye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false },
    contactInfo: { type: String, required: true}
});

const Listing = mongoose.model('Listing', listingSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/frontpage.html'));
});

app.get('/createListing', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/createListing.html'));
});

app.post('/createListing', upload.single('image'), (req, res) => {
    const newListing = new Listing({
        title: req.body.title,
        description: req.body.description,
        image: req.file.path,
        contactInfo: req.body.contactInfo
    });

    newListing.save()
        .then(() => res.status(201).send('Listing created successfully!'))
        .catch(err => {
            console.error(err);
            res.status(400).send('Error creating listing: ' + err.message);
        });
});

app.listen(port, () => {
    console.log(`Dorm Dash app is listening at http://localhost:${port}`);
});
