import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, ArrowRight } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const { trips, currencySymbol, convertCost } = useTrips();

    // Mock recommendations (India Focused)
    const recommendations = [
        {
            id: 1,
            title: 'Royal Rajasthan',
            location: 'Jaipur & Udaipur, India',
            image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=800',
            days: 6,
            price: '₹25,000'
        },
        {
            id: 2,
            title: 'Kerala Backwaters',
            location: 'Alleppey, India',
            image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800',
            days: 4,
            price: '₹18,000'
        },
        {
            id: 3,
            title: 'Himalayan Trek',
            location: 'Manali, India',
            image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800',
            days: 5,
            price: '₹12,000'
        }
    ];

    const quickActions = [
        { icon: <Plus size={20} />, label: 'Plan Trip', link: '/create-trip', color: 'var(--primary)' },
        { icon: <MapPin size={20} />, label: 'Explore Cities', link: '/explore', color: 'var(--warm)' },
        { icon: <Calendar size={20} />, label: 'My Calendar', link: '/trips', color: '#00C49F' }
    ];

    return (
        <div className="fade-in">
            {/* Header */}
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>
                    Welcome back, <span className="text-gradient">{user?.name}</span>
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Ready for your next adventure?</p>
            </header>

            {/* Quick Actions Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {quickActions.map((action, i) => (
                    <Link key={i} to={action.link} className="glass-panel" style={{
                        padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none',
                        transition: 'transform 0.2s', borderLeft: `4px solid ${action.color}`
                    }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ padding: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: action.color }}>
                            {action.icon}
                        </div>
                        <span style={{ fontSize: '18px', fontWeight: '500', color: 'white' }}>{action.label}</span>
                    </Link>
                ))}
            </div>

            {/* Banner */}
            <div className="glass-panel" style={{
                padding: '30px',
                marginBottom: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px',
                background: 'linear-gradient(135deg, rgba(15, 76, 117, 0.3), rgba(30,30,30,0.5))'
            }}>
                <div>
                    <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>AI-Powered Travel Assistant</h2>
                    <p style={{ color: '#ccc', maxWidth: '500px' }}>
                        Need help? Chat with Payanam Bot to discover hidden gems and build perfect itineraries in seconds.
                    </p>
                </div>
                {/* Chatbot trigger handled by floating widget, maybe link to create trip here too */}
                <Link to="/create-trip" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={20} /> Plan New Adventure
                </Link>
            </div>

            {/* Upcoming Trips */}
            <section style={{ marginBottom: '50px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>Your Trips</h2>
                    <Link to="/trips" style={{ color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        View all <ArrowRight size={16} />
                    </Link>
                </div>

                {trips.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed #444', borderRadius: '12px' }}>
                        <p>No trips yet. Start planning!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {trips.slice(0, 3).map(trip => (
                            <Link to={`/trips/${trip.id}`} key={trip.id} className="glass-panel" style={{ overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer', display: 'block', textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ height: '160px', overflow: 'hidden' }}>
                                    <img src={trip.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800'}
                                        alt={trip.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800'; }}
                                    />
                                </div>
                                <div style={{ padding: '20px' }}>
                                    <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{trip.title}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', fontSize: '14px', marginBottom: '6px' }}>
                                        <MapPin size={14} /> {trip.destination}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', fontSize: '14px' }}>
                                        <Calendar size={14} /> {trip.startDate}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Recommendations */}
            <section>
                <h2 style={{ marginBottom: '20px' }}>Recommended for You</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {recommendations.map(place => (
                        <div key={place.id} className="glass-panel" style={{ overflow: 'hidden' }}>
                            <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                <img src={place.image} alt={place.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute', bottom: 10, right: 10,
                                    backgroundColor: 'rgba(0,0,0,0.7)', padding: '4px 12px',
                                    borderRadius: '20px', fontSize: '12px'
                                }}>
                                    {place.days} Days
                                </div>
                            </div>
                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '18px' }}>{place.title}</h3>
                                    <span style={{ color: 'var(--warm)', fontWeight: 'bold' }}>{currencySymbol}{convertCost(parseInt(place.price.replace(/[^0-9]/g, '')))}</span>
                                </div>
                                <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '16px' }}>
                                    {place.location}
                                </div>
                                <Link to="/create-trip" state={{ destination: place.location }} className="btn-secondary" style={{ width: '100%', fontSize: '14px', padding: '8px', display: 'block', textAlign: 'center' }}>
                                    Explore Itinerary
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div >
    );
};

export default Dashboard;
