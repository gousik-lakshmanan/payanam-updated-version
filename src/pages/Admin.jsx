import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Briefcase, Map } from 'lucide-react';

const Admin = () => {
    // Mock user specific analytics
    const visitedPlaces = [
        { id: 1, name: 'Jaipur, Rajasthan', date: '2025-01-15' },
        { id: 2, name: 'Goa', date: '2024-12-20' },
        { id: 3, name: 'Manali, HP', date: '2024-11-10' }
    ];

    const data = [
        { name: 'Jan', budget: 40000, spent: 24000 },
        { name: 'Feb', budget: 30000, spent: 13980 },
        { name: 'Mar', budget: 20000, spent: 9800 },
        { name: 'Apr', budget: 27800, spent: 39080 },
        { name: 'May', budget: 18900, spent: 4800 },
        { name: 'Jun', budget: 23900, spent: 38000 },
    ];

    return (
        <div className="fade-in">
            <h1 style={{ marginBottom: '30px' }}>Your Travel Analytics</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ padding: '16px', background: 'rgba(50, 130, 184, 0.2)', borderRadius: '12px', color: 'var(--primary-light)' }}>
                        <Map size={32} />
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', color: '#aaa' }}>Places Visited</div>
                        <div style={{ fontSize: '28px', fontWeight: 'bold' }}>12</div>
                        <div style={{ fontSize: '12px', color: '#4dff4d' }}>3 this year</div>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ padding: '16px', background: 'rgba(255, 136, 75, 0.2)', borderRadius: '12px', color: 'var(--warm)' }}>
                        <Briefcase size={32} />
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', color: '#aaa' }}>Total Trips</div>
                        <div style={{ fontSize: '28px', fontWeight: 'bold' }}>8</div>
                        <div style={{ fontSize: '12px', color: '#4dff4d' }}>+2 upcoming</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                <div className="glass-panel" style={{ padding: '30px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Monthly Budget Usage (₹)</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="name" stroke="#aaa" />
                                <YAxis stroke="#aaa" />
                                <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444' }} />
                                <Legend />
                                <Bar dataKey="budget" fill="#3282B8" name="Budget" />
                                <Bar dataKey="spent" fill="#FF884B" name="Actual Spent" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '30px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Places Visited Log</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {visitedPlaces.map((place, i) => (
                            <li key={i} style={{ padding: '12px 0', borderBottom: '1px solid #333' }}>
                                <div style={{ fontWeight: '500' }}>{place.name}</div>
                                <div style={{ fontSize: '12px', color: '#aaa' }}>Visited: {place.date}</div>
                                <button style={{ marginTop: '5px', fontSize: '10px', padding: '2px 8px' }} className="btn-secondary">Add Photos</button>
                            </li>
                        ))}
                    </ul>
                    <button className="btn-primary" style={{ width: '100%', marginTop: '20px' }}>Add New Place</button>
                </div>
            </div>
        </div>
    );
};

export default Admin;
