const mongoose = require('mongoose');

const fileContentSchema = new mongoose.Schema({
    id: String,
    time: String,
    title: String,
    type: String, // food, culture, sightseeing, other, transport
    cost: Number
}, { _id: false });

const dayItinerarySchema = new mongoose.Schema({
    date: String,
    activities: [fileContentSchema]
}, { _id: false });

const tripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    budget: {
        type: Number,
        default: 0
    },
    travelers: {
        type: Number,
        default: 1
    },
    description: String,
    itinerary: [dayItinerarySchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Trip', tripSchema);
