import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { User, Mail, Globe, Moon, Bell, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, updateUser, logout } = useAuth();
    const { currency, setCurrency } = useTrips();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');

    const handleUpdate = () => {
        updateUser({ name, avatar: avatarUrl });
        alert('Profile Updated!');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // In a real app, call delete dialog. For demo just logout.
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="fade-in">
            <h1 style={{ marginBottom: '30px' }}>Your Profile</h1>

            <div className="glass-panel" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <img src={avatarUrl || 'https://ui-avatars.com/api/?name=' + (name || 'User') + '&background=random'} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
                        <label htmlFor="avatar-upload" className="btn-secondary" style={{ position: 'absolute', bottom: -10, right: -10, borderRadius: '50%', padding: '8px', cursor: 'pointer' }}>
                            <User size={16} />
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '12px' }}>Avatar URL (or upload image)</label>
                        <input
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                        />
                    </div>
                </div>

                <div className="responsive-grid-2" style={{ marginBottom: '30px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#666' }} />
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #444', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}>Email (Read Only)</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#666' }} />
                            <input
                                value={user?.email}
                                disabled
                                style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #333', background: 'rgba(0,0,0,0.5)', color: '#888', cursor: 'not-allowed' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <h3 style={{ marginBottom: '16px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>Preferences</h3>
                <div className="responsive-grid-2" style={{ marginBottom: '30px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}>Language</label>
                        <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: 'white' }}>
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}>Currency (Global)</label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: 'white' }}
                        >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                        </select>
                    </div>
                </div>

                {/* Saved Destinations Mock */}
                <h3 style={{ marginBottom: '16px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>Saved Destinations</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
                    {['Paris', 'Bali', 'Kyoto', 'Manali'].map(place => (
                        <div key={place} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={12} /> {place}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #333' }}>
                    <button
                        onClick={handleDeleteAccount}
                        className="btn-secondary"
                        style={{ color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}
                    >
                        Delete Account
                    </button>

                    <button onClick={handleUpdate} className="btn-primary">
                        Save Changes
                    </button>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <a href="/admin" style={{ fontSize: '12px', color: '#666', textDecoration: 'none' }}>
                        Admin Dashboard Access
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Profile;
