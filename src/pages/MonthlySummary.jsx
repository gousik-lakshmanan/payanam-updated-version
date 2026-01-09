import React, { useState, useMemo } from 'react';
import { useTrips } from '../context/TripContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

const MonthlySummary = () => {
    const { trips, currencySymbol, convertCost } = useTrips();
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    // Filter data for the selected month
    const monthlyData = useMemo(() => {
        const year = parseInt(selectedMonth.split('-')[0]);
        const month = parseInt(selectedMonth.split('-')[1]) - 1; // 0-indexed

        let activitiesInMonth = [];
        let tripsInMonth = [];
        let visitedPlaces = new Set();
        let totalSpent = 0;
        let spendingByCity = {};
        let spendingByDay = {};

        trips.forEach(trip => {
            const tripStart = new Date(trip.startDate);
            const tripEnd = new Date(trip.endDate);

            // Check if trip overlaps with selected month (simple check: if any activity is in month)
            // Or if trip start/end overlaps. 
            // We will focus on ACTIVITIES for specific spending/places in this month.

            let tripHasActivityInMonth = false;

            if (trip.itinerary) {
                trip.itinerary.forEach(day => {
                    const dayDate = new Date(day.date);
                    if (dayDate.getFullYear() === year && dayDate.getMonth() === month) {
                        tripHasActivityInMonth = true;

                        // Process activities
                        if (day.activities) {
                            day.activities.forEach(act => {
                                activitiesInMonth.push({ ...act, date: day.date, tripTitle: trip.title, destination: trip.destination });
                                totalSpent += (act.cost || 0);

                                // City Spending
                                spendingByCity[trip.destination] = (spendingByCity[trip.destination] || 0) + (act.cost || 0);

                                // Day Spending
                                const dayKey = new Date(day.date).getDate(); // 1-31
                                spendingByDay[dayKey] = (spendingByDay[dayKey] || 0) + (act.cost || 0);
                            });
                        }
                    }
                });
            }

            // If trip has activity in month, or just strictly overlaps without activities defined yet
            if (tripHasActivityInMonth || (tripStart.getMonth() === month && tripStart.getFullYear() === year) || (tripEnd.getMonth() === month && tripEnd.getFullYear() === year)) {
                tripsInMonth.push(trip);
                if (trip.destination) visitedPlaces.add(trip.destination);
            }
        });

        // Parse places for State/Country grouping
        const groupedPlaces = {};
        Array.from(visitedPlaces).forEach(place => {
            // Assume format "City, Country" or "City, State, Country"
            const parts = place.split(',').map(s => s.trim());
            const country = parts[parts.length - 1] || 'Unknown';
            const state = parts.length > 2 ? parts[parts.length - 2] : 'General';

            if (!groupedPlaces[country]) groupedPlaces[country] = {};
            if (!groupedPlaces[country][state]) groupedPlaces[country][state] = [];
            groupedPlaces[country][state].push(place);
        });

        return {
            activities: activitiesInMonth,
            visitedPlaces,
            groupedPlaces,
            trips: tripsInMonth,
            totalSpent,
            spendingByCity,
            spendingByDay
        };
    }, [trips, selectedMonth]);

    // Chart Data Preparation
    const barData = Object.keys(monthlyData.spendingByDay).map(day => ({
        day: `Day ${day}`,
        amount: convertCost(monthlyData.spendingByDay[day]),
        rawAmount: monthlyData.spendingByDay[day]
    })).sort((a, b) => parseInt(a.day.split(' ')[1]) - parseInt(b.day.split(' ')[1]));

    const pieData = Object.keys(monthlyData.spendingByCity).map(city => ({
        name: city,
        value: convertCost(monthlyData.spendingByCity[city]),
        rawValue: monthlyData.spendingByCity[city]
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="responsive-flex-wrap" style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link to="/trips" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', textDecoration: 'none' }}>
                        <ArrowLeft size={20} /> Back
                    </Link>
                    <h1>Monthly Travel Summary</h1>
                </div>
                <div>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#333', color: 'white', fontSize: '16px' }}
                    />
                </div>
            </div>

            {/* Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '12px', borderRadius: '50%', background: 'rgba(255,136,75,0.2)', color: '#FF884B' }}>
                        <MapPin size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', color: '#aaa' }}>Places Visited</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{monthlyData.visitedPlaces.size}</div>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '12px', borderRadius: '50%', background: 'rgba(0,196,159,0.2)', color: '#00C49F' }}>
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', color: '#aaa' }}>Total Spent</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{currencySymbol}{convertCost(monthlyData.totalSpent)}</div>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '12px', borderRadius: '50%', background: 'rgba(0,136,254,0.2)', color: '#0088FE' }}>
                        <Calendar size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', color: '#aaa' }}>Active Trips</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{monthlyData.trips.length}</div>
                    </div>
                </div>
            </div>

            <div className="responsive-grid-2" style={{ marginBottom: '30px' }}>
                {/* Places List */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Places Visited</h3>
                    {monthlyData.visitedPlaces.size === 0 ? (
                        <p style={{ color: '#666' }}>No travel data for this month.</p>
                    ) : (
                        Object.entries(monthlyData.groupedPlaces).map(([country, states]) => (
                            <div key={country} style={{ marginBottom: '20px' }}>
                                <h4 style={{ color: '#aaa', textTransform: 'uppercase', fontSize: '12px', marginBottom: '10px' }}>{country}</h4>
                                {Object.entries(states).map(([state, cities]) => (
                                    <div key={state} style={{ marginLeft: '10px', marginBottom: '10px' }}>
                                        {/* State Header if needed, mostly cities are what users care about */}
                                        {cities.map(city => (
                                            <div key={city} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', marginBottom: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <MapPin size={14} color="var(--primary)" />
                                                <span>{city}</span>
                                                <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#888' }}>
                                                    {monthlyData.activities.filter(a => a.destination === city).length} Activities
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>

                {/* Spending Charts */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Spending Analysis</h3>
                    <div style={{ height: '300px' }}>
                        {barData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis dataKey="day" stroke="#aaa" fontSize={12} />
                                    <YAxis stroke="#aaa" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#333', border: 'none' }}
                                        labelStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                                No spending data available.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Map View */}
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', height: '400px', marginBottom: '30px', position: 'relative' }}>
                {monthlyData.visitedPlaces.size > 0 ? (
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0, opacity: 0.9 }}
                        // Show the first visited place as the center, google maps embed will search for it
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(Array.from(monthlyData.visitedPlaces)[0])}&t=&z=6&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#222', color: '#666' }}>
                        <div style={{ textAlign: 'center' }}>
                            <MapPin size={48} style={{ marginBottom: '10px', opacity: 0.2 }} />
                            <p>No locations to map for this month.</p>
                        </div>
                    </div>
                )}
                <div style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '8px',
                    pointerEvents: 'none'
                }}>
                    <span style={{ fontSize: '12px' }}>Map View: {monthlyData.visitedPlaces.size > 0 ? Array.from(monthlyData.visitedPlaces).join(' | ') : 'None'}</span>
                </div>
            </div>
        </div>
    );
};

export default MonthlySummary;
