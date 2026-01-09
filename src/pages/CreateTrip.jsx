import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { Calendar, MapPin, DollarSign, Users, Sparkles } from 'lucide-react';

const CreateTrip = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addTrip, currency, currencySymbol, rates } = useTrips();
    const [formData, setFormData] = useState({
        destination: location.state?.destination || '',
        startDate: '',
        endDate: '',
        budget: '', // Stores the RAW input value
        travelers: 1,
        description: '',
        imageUrl: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsGenerating(true);

        const currentRate = rates[currency] || 1;
        // Convert input budget to INR for storage
        const budgetInINR = Math.round(Number(formData.budget) / currentRate);

        setTimeout(async () => {
            const daysCount = calculateDays(formData.startDate, formData.endDate);
            const itinerary = [];

            // Generate unique activities for each day to prevent duplication bug
            for (let i = 0; i < daysCount; i++) {
                const date = addDays(formData.startDate, i);
                itinerary.push({
                    date,
                    activities: generateMockActivities(formData.destination, i + 1) // Pass day number for uniqueness
                });
            }

            try {
                const newTrip = await addTrip({
                    title: `Trip to ${formData.destination}`,
                    destination: formData.destination,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    budget: budgetInINR,
                    travelers: Number(formData.travelers),
                    description: formData.description || `A wonderful trip to ${formData.destination}`,
                    itinerary: itinerary,
                    image: formData.imageUrl || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800`
                });

                setIsGenerating(false);
                if (newTrip && newTrip.id) {
                    navigate(`/trips/${newTrip.id}`);
                } else {
                    console.error("Trip creation failed or returned no ID");
                    // Optionally navigate to dashboard as fallback
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error("Failed to create trip:", error);
                setIsGenerating(false);
            }
        }, 2500);
    };

    const addDays = (dateStr, days) => {
        const result = new Date(dateStr);
        result.setDate(result.getDate() + days);
        return result.toISOString().split('T')[0];
    };

    const calculateDays = (start, end) => {
        const d1 = new Date(start);
        const d2 = new Date(end);
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    // Advanced Mock Activity Generator
    const generateMockActivities = (dest, dayNum) => {
        // Helper to pick random item
        const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        // Helper to capitalize destination
        const formatDest = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : 'City';
        const city = formatDest(dest);

        const morningActivities = [
            { title: `Sunrise view at ${city} Hills`, type: 'sightseeing', cost: 0 },
            { title: `Traditional Breakfast at 'The ${city} Keep'`, type: 'food', cost: 450 },
            { title: `Guided Heritage Walk through Old ${city}`, type: 'culture', cost: 800 },
            { title: 'Morning Nature Hiking & Birdwatching', type: 'sightseeing', cost: 200 },
            { title: `Visit the famous ${city} Botanical Gardens`, type: 'sightseeing', cost: 300 },
            { title: 'Local Coffee & Pastry Tasting', type: 'food', cost: 600 },
            { title: `Yoga Session by the ${city} Lake`, type: 'culture', cost: 500 }
        ];

        const afternoonActivities = [
            { title: `Local Delicacies Lunch`, type: 'food', cost: 700 },
            { title: `Adventure Sports: Paragliding/Zipline`, type: 'other', cost: 2500 },
            { title: `Visit ${city} National Museum`, type: 'culture', cost: 500 },
            { title: 'Relaxing Boat Ride / River Walk', type: 'sightseeing', cost: 400 },
            { title: 'Shopping for Souvenirs at Main Bazaar', type: 'culture', cost: 1500 },
            { title: `Explore Ancient Ruins of ${city}`, type: 'sightseeing', cost: 250 },
            { title: 'Photography Tour of Hidden Alleys', type: 'sightseeing', cost: 1200 }
        ];

        const eveningActivities = [
            { title: `Sunset Dinner with a View`, type: 'food', cost: 1200 },
            { title: 'Cultural Dance Performance', type: 'culture', cost: 1000 },
            { title: 'Night Market Street Food Tour', type: 'food', cost: 600 },
            { title: 'Stargazing / Campfire Night', type: 'other', cost: 500 },
            { title: `Live Music at 'The Rusty Soul'`, type: 'culture', cost: 1500 },
            { title: 'Evening City Lights Drive', type: 'sightseeing', cost: 1000 },
            { title: 'Cocktails at Sky Bar', type: 'food', cost: 2000 }
        ];

        // Ensure we don't pick the same activity structure every day by shuffling times slightly
        const schedule = [
            { time: '09:00', ...getRandom(morningActivities) },
            { time: '13:00', ...getRandom(afternoonActivities) },
            { time: '17:00', title: 'Relaxation & Leisure Time', type: 'other', cost: 0 },
            { time: '20:00', ...getRandom(eveningActivities) }
        ];

        // Randomize the "Relaxation" slot occasionally
        if (Math.random() > 0.5) {
            schedule[2] = { time: '16:30', title: 'Afternoon High Tea / Snacks', type: 'food', cost: 350 };
        }

        return schedule.map((act, idx) => ({
            id: `d${dayNum}-a${idx}-${Math.random().toString(36).substr(2, 9)}`,
            ...act,
            // Add slight random variation to cost (±10%) to look genuine
            cost: act.cost > 0 ? Math.round(act.cost * (0.9 + Math.random() * 0.2)) : 0
        }));
    };

    return (
        <div className="fade-inContainer" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px' }}>Plan Your Next Adventure</h1>

            {isGenerating ? (
                <div style={{ textAlign: 'center', padding: '60px', borderRadius: '12px', background: 'var(--bg-card)' }}>
                    <Sparkles size={48} className="fade-in" style={{ color: 'var(--warm)', marginBottom: '20px', animation: 'spin 3s linear infinite' }} />
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                    <h2>Consulting Payanam Bot AI...</h2>
                    <p style={{ color: '#aaa' }}>Crafting a unique day-by-day itinerary for {formData.destination}...</p>
                </div>
            ) : (
                <div className="glass-panel" style={{ padding: '40px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Where to?</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#aaa' }} />
                                <input
                                    required
                                    name="destination"
                                    value={formData.destination}
                                    onChange={handleChange}
                                    placeholder="e.g. Manali, Goa, Jaipur"
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #444', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Trip Description (Optional)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your trip goal e.g. 'Relaxing weekend getaway'"
                                rows="3"
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', background: 'rgba(0,0,0,0.2)', color: 'white', resize: 'vertical' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Cover Image URL (Optional)</label>
                            <input
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            />
                        </div>

                        <div className="responsive-grid-2">
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Start Date</label>
                                <input
                                    required
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>End Date</label>
                                <input
                                    required
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                />
                            </div>
                        </div>

                        <div className="responsive-grid-2">
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Budget ({currency} {currencySymbol})</label>
                                <div style={{ position: 'relative' }}>
                                    <DollarSign size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#aaa' }} />
                                    <input
                                        required
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        placeholder="50000"
                                        style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #444', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Travelers</label>
                                <div style={{ position: 'relative' }}>
                                    <Users size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#aaa' }} />
                                    <input
                                        required
                                        type="number"
                                        name="travelers"
                                        min="1"
                                        value={formData.travelers}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #444', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Sparkles size={18} /> Generate Itinerary with AI
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CreateTrip;
