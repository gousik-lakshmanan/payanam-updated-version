import React from 'react';
import { useTrips } from '../context/TripContext';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Plus, Trash2, PieChart } from 'lucide-react';

const MyTrips = () => {
    const { trips, deleteTrip, currencySymbol, convertCost } = useTrips();

    const handleDelete = (e, id) => {
        e.preventDefault(); // Prevent navigation
        if (window.confirm('Are you sure you want to delete this trip? It cannot be undone.')) {
            deleteTrip(id);
        }
    };

    return (
        <div className="fade-in">
            <div className="responsive-flex-wrap" style={{ marginBottom: '30px' }}>
                <h1>My Trips</h1>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Link to="/monthly-summary" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PieChart size={20} /> Monthly Travel Summary
                    </Link>
                    <Link to="/create-trip" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={20} /> Plan New Trip
                    </Link>
                </div>
            </div>

            {trips.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', border: '1px dashed #444', borderRadius: '12px' }}>
                    <h2>No trips yet</h2>
                    <p style={{ color: '#aaa', margin: '10px 0 20px' }}>Start planning your next adventure today!</p>
                    <Link to="/create-trip" className="btn-primary">Plan Now</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {trips.map(trip => (
                        <div key={trip.id} className="glass-panel" style={{ height: '100%', transition: 'transform 0.2s', position: 'relative', overflow: 'hidden' }}>
                            <Link to={`/trips/${trip.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                                <div style={{ height: '200px', backgroundColor: '#333' }}>
                                    <img
                                        src={trip.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800'}
                                        alt={trip.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800'; }}
                                    />
                                </div>
                                <div style={{ padding: '20px' }}>
                                    <h3 style={{ fontSize: '20px', marginBottom: '12px', color: 'white' }}>{trip.title}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', marginBottom: '8px' }}>
                                        <MapPin size={16} /> {trip.destination}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', marginBottom: '12px' }}>
                                        <Calendar size={16} /> {new Date(trip.startDate).toLocaleDateString()}
                                    </div>
                                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                                            {currencySymbol}{convertCost(parseInt(trip.budget))} Budget
                                        </span>
                                    </div>
                                </div>
                            </Link>
                            <button
                                onClick={(e) => handleDelete(e, trip.id)}
                                style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    background: 'rgba(0,0,0,0.6)', color: '#ff6b6b',
                                    border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', zIndex: 10
                                }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTrips;
