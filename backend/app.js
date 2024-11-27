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

const session = require('express-session');

app.use(session({
    secret: 'SecretKey',
    resave: false,
    saveUninitialized: true,
}));

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        // User is authenticated, proceed to the next middleware or route
        next();
    } else {
        // User is not authenticated, redirect to the home page
        res.redirect('/');
    }
}

// Routing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/home.html'));
});

app.get('/frontPage', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/frontPage.html'));
});


app.get('/createListing', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/createListing.html'));
});


// Listing Model
const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: Buffer, required: false },
    imageType: { type: String },
    contactInfo: { type: String, required: true}
});

const Listing = mongoose.model('Listing', listingSchema);

// Routes for Listing
// Route to display listings
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

// Route to create listing
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

// User Model
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Route for Users
app.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email.endsWith('@students.towson.edu')) {
            return res.status(400).send('Invalid email. Must be a TU email.');
        }
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).send('User signed up successfully!');

        // Redirect to front page
        // res.redirect('/frontPage');
    } catch (err) {
        console.error(err);
        res.status(400).send('Error signing up: ' + err.message);
    }
});

// Route for user login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).send('Invalid credentials');
        }

        // Save user info to session
        req.session.user = { email };

        res.status(200).send('Login successful!');

        // Redirect to front page
        //res.redirect('/frontPage');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in: ' + err.message);
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/home');
    });
});

// Routes for Profile
app.get('/api/user/profile', (req, res) => {
    if (req.session && req.session.user) {
        const email = req.session.user.email;

        User.findOne({ email })
            .then(user => {
                res.json({
                    name: user.name || 'John Doe',
                    email: user.email,
                    listings: [] // Include logic to fetch user-specific listings
                });
            })
            .catch(err => res.status(500).send('Error fetching profile: ' + err.message));
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.post('/api/user/profile/update', (req, res) => {
    if (req.session && req.session.user) {
        const email = req.session.user.email;

        User.findOneAndUpdate({ email }, req.body, { new: true })
            .then(updatedUser => {
                res.json({ message: 'Profile updated successfully!', user: updatedUser });
            })
            .catch(err => res.status(500).send('Error updating profile: ' + err.message));
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.get('/api/user/listings', (req, res) => {
    if (req.session && req.session.user) {
        const email = req.session.user.email;

        Listing.find({ contactInfo: email })
            .then(listings => res.json(listings))
            .catch(err => res.status(500).send('Error fetching listings: ' + err.message));
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.get('/api/user', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});


app.listen(port, () => {
    console.log(`Dorm Dash app is listening at http://localhost:${port}`);
});
