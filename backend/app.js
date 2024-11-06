const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const url = "mongodb+srv://cedesjohn56:Minecraft5656@cluster0.dkrye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: Buffer, required: false },
    imageType: { type: String },
    contactInfo: { type: String, required: true}
});

const Listing = mongoose.model('Listing', listingSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/frontpage.html'));
});

app.get('/createListing', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/createListing.html'));
});

app.get('/api/listings', async (req, res) => {
    try {
        const listing = await Listing.find();
        const listingWithImg = listing.map(listing => {
            return {
                ...listing.toObject(),
                image: listing.image ? `data:${listing.imageType};base64,${listing.image.toString('base64')}` : null
            }
        })
        res.json(listingWithImg);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching listings');
    }
});

app.post('/createListing', upload.single('image'), (req, res) => {
    const newListing = new Listing({
        title: req.body.title,
        description: req.body.description,
        image: req.file ? req.file.buffer : null,
        imageType: req.file ? req.file.mimetype : null,
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
