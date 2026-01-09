import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { Calendar, MapPin, Clock, DollarSign, Plus, ArrowLeft, Trash2, Printer } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const ItineraryView = () => {
    const { tripId } = useParams();
    const { trips, selectTrip, currentTrip, addActivityToTrip, deleteActivityFromTrip, currencySymbol, convertCost } = useTrips();
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newActivity, setNewActivity] = useState({ title: '', time: '09:00', type: 'sightseeing', cost: 0 });

    useEffect(() => {
        // If we have trips loaded, select the current one
        if (trips.length > 0) {
            selectTrip(tripId);
        }
    }, [tripId, trips]);

    if (!currentTrip) {
        return <div style={{ padding: '40px' }}>Loading Trip...</div>;
    }

    const days = currentTrip.itinerary || [];
    // Ensure we are selecting the correct day object, not defaulting to first day if index is valid
    const selectedDay = (days.length > 0 && days[selectedDayIndex]) ? days[selectedDayIndex] : { date: currentTrip.startDate, activities: [] };

    // Calculate costs
    const totalCost = days.reduce((acc, day) => {
        return acc + day.activities.reduce((dAcc, act) => dAcc + (act.cost || 0), 0);
    }, 0);

    // Chart Data by Category
    const costByCategory = days.reduce((acc, day) => {
        day.activities.forEach(act => {
            acc[act.type] = (acc[act.type] || 0) + (act.cost || 0);
        });
        return acc;
    }, {});

    const chartData = Object.keys(costByCategory).map(key => ({ name: key, value: convertCost(costByCategory[key]) }));
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    const handleAddActivity = () => {
        if (!newActivity.title) return;
        const act = {
            id: `new-${Date.now()}`,
            ...newActivity,
            cost: Number(newActivity.cost)
        };

        addActivityToTrip(tripId, selectedDay.date, act);
        setShowAddModal(false);
        setNewActivity({ title: '', time: '09:00', type: 'sightseeing', cost: 0 });
    };

    const handleDeleteActivity = (actId) => {
        if (window.confirm('Are you sure you want to remove this activity?')) {
            deleteActivityFromTrip(tripId, selectedDay.date, actId);
        }
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="responsive-flex-wrap" style={{ marginBottom: '30px' }}>
                <div>
                    <Link to="/trips" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', marginBottom: '10px' }}>
                        <ArrowLeft size={16} /> Back to Trips
                    </Link>
                    <h1 style={{ fontSize: '32px' }}>{currentTrip.title}</h1>
                    <div style={{ display: 'flex', gap: '20px', color: '#ccc', marginTop: '8px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={16} /> {new Date(currentTrip.startDate).toLocaleDateString()} - {new Date(currentTrip.endDate).toLocaleDateString()}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={16} /> {currentTrip.destination}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <DollarSign size={16} /> Budget: {currencySymbol}{convertCost(currentTrip.budget)}
                        </span>
                    </div>
                </div>
                <div>
                    <button
                        onClick={() => window.print()}
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Printer size={16} /> Print Itinerary
                    </button>
                </div>
            </div>

            <div className="itinerary-grid">
                {/* Main Content */}
                <div>
                    {/* Day Tabs */}
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
                        {days.map((day, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedDayIndex(index)}
                                style={{
                                    padding: '10px 20px',
                                    background: selectedDayIndex === index ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    borderRadius: '20px',
                                    whiteSpace: 'nowrap',
                                    border: selectedDayIndex === index ? 'none' : '1px solid #444'
                                }}
                            >
                                Day {index + 1}
                            </button>
                        ))}
                    </div>

                    {/* Day View */}
                    <div className="glass-panel" style={{ padding: '30px', minHeight: '400px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '24px' }}>
                                Day {selectedDayIndex + 1}
                                <span style={{ fontSize: '16px', color: '#aaa', marginLeft: '10px' }}>{new Date(selectedDay.date).toDateString()}</span>
                            </h2>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="btn-primary"
                                style={{ padding: '8px 16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Plus size={16} /> Add Activity
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {selectedDay.activities.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                    No activities scheduled for this day
                                </div>
                            ) : (
                                selectedDay.activities.map(act => (
                                    <div key={act.id} style={{
                                        display: 'flex', gap: '12px', padding: '12px',
                                        background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
                                        borderLeft: `4px solid ${getColorForType(act.type)}`,
                                        alignItems: 'center',
                                        maxWidth: '100%'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '45px' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{act.time}</span>
                                            <div style={{ width: '1px', height: '100%', background: '#444', marginTop: '8px' }}></div>
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '4px' }}>
                                                <h3 style={{ fontSize: '16px', wordBreak: 'break-word' }}>{act.title}</h3>
                                                <span style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>{currencySymbol}{convertCost(act.cost)}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <span style={{
                                                    fontSize: '11px', padding: '2px 8px', borderRadius: '4px',
                                                    background: 'rgba(255,255,255,0.1)', textTransform: 'capitalize'
                                                }}>
                                                    {act.type}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteActivity(act.id)}
                                            style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', padding: '8px', flexShrink: 0 }}
                                            className="hover-red"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Budget Summary */}
                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <DollarSign size={18} /> Cost Breakdown
                        </h3>
                        <div style={{ height: '200px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ marginTop: '16px', borderTop: '1px solid #444', paddingTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Total Spent</span>
                                <span style={{ fontWeight: 'bold', color: totalCost > currentTrip.budget ? '#ff4d4d' : '#4dff4d' }}>{currencySymbol}{convertCost(totalCost)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}>
                                <span>Budget</span>
                                <span>{currencySymbol}{convertCost(currentTrip.budget)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Map (Google Maps Embed) */}
                    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', height: '300px', position: 'relative' }}>
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0, opacity: 0.9 }}
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(currentTrip.destination)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                        <div style={{
                            position: 'absolute', bottom: '10px', left: '10px',
                            background: 'rgba(0,0,0,0.7)', padding: '5px 10px', borderRadius: '4px',
                            pointerEvents: 'none'
                        }}>
                            <span style={{ fontSize: '12px' }}>Map: {currentTrip.destination}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Activity Modal - Simplified */}
            {showAddModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="glass-panel" style={{ width: '90%', maxWidth: '400px', padding: '30px', background: '#222' }}>
                        <h3 style={{ marginBottom: '20px' }}>Add Activity</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input
                                type="text" placeholder="Activity Title"
                                value={newActivity.title} onChange={e => setNewActivity({ ...newActivity, title: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: 'none', background: '#333', color: 'white' }}
                            />
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                <input
                                    type="time"
                                    value={newActivity.time} onChange={e => setNewActivity({ ...newActivity, time: e.target.value })}
                                    style={{ flex: '1 1 120px', padding: '10px', borderRadius: '8px', border: 'none', background: '#333', color: 'white' }}
                                />
                                <input
                                    type="number" placeholder="Cost"
                                    value={newActivity.cost} onChange={e => setNewActivity({ ...newActivity, cost: e.target.value })}
                                    style={{ flex: '1 1 120px', padding: '10px', borderRadius: '8px', border: 'none', background: '#333', color: 'white' }}
                                />
                            </div>
                            <select
                                value={newActivity.type} onChange={e => setNewActivity({ ...newActivity, type: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: 'none', background: '#333', color: 'white' }}
                            >
                                <option value="sightseeing">Sightseeing</option>
                                <option value="food">Food</option>
                                <option value="transport">Transport</option>
                                <option value="culture">Culture</option>
                                <option value="other">Other</option>
                            </select>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button onClick={handleAddActivity} className="btn-primary" style={{ flex: 1 }}>Add</button>
                                <button onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const getColorForType = (type) => {
    const map = {
        sightseeing: '#3282B8',
        food: '#FF884B',
        transport: '#BBE1FA',
        culture: '#d4af37',
        other: '#999'
    };
    return map[type] || map.other;
};

export default ItineraryView;
