const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import Models
const User = require('./models/User');
const Trip = require('./models/Trip');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/payanam_local')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ MongoDB Connection Error:', err));

// --- Middleware for Auth ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- ROUTES ---

// 1. Auth Routes
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // Generate Token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET || 'secret');

        res.json({ token, user: { id: savedUser._id, name: savedUser.name, email: savedUser.email, avatar: savedUser.avatar, preferences: savedUser.preferences } });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, preferences: user.preferences } });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Trip Routes
// GET all trips for logged in user
app.get('/api/trips', authenticateToken, async (req, res) => {
    try {
        const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
        // Transform _id to id for frontend compatibility if needed, though Mongo uses _id
        const formattedTrips = trips.map(trip => ({
            ...trip.toObject(),
            id: trip._id // Ensure frontend gets 'id'
        }));
        res.json(formattedTrips);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new trip
app.post('/api/trips', authenticateToken, async (req, res) => {
    try {
        const newTrip = new Trip({
            userId: req.user.id,
            ...req.body
        });
        const savedTrip = await newTrip.save();
        res.json({ ...savedTrip.toObject(), id: savedTrip._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE trip (including adding activities)
app.put('/api/trips/:id', authenticateToken, async (req, res) => {
    try {
        // Ensure user owns the trip
        const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        const updatedTrip = await Trip.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json({ ...updatedTrip.toObject(), id: updatedTrip._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE trip
app.delete('/api/trips/:id', authenticateToken, async (req, res) => {
    try {
        const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        res.json({ message: 'Trip deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Payanam Backend is Running!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
