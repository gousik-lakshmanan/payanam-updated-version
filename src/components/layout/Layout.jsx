import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Compass, Map, Calendar, User, LogOut, PlusCircle, Globe, Menu, X } from 'lucide-react';
import styles from './Layout.module.css';
import ChatWidget from '../common/ChatWidget';

import { useTrips } from '../../context/TripContext';

const Layout = () => {
    const { user, logout } = useAuth();
    const { currency, setCurrency } = useTrips();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const isActive = (path) => location.pathname === path;
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Close sidebar when route changes on mobile
    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    return (
        <div className={styles.layout}>
            {/* Mobile Header */}
            <div className={styles.mobileHeader}>
                <div className={styles.logo} style={{ marginBottom: 0, fontSize: '20px' }}>
                    <Compass size={24} color="var(--primary-light)" />
                    <span>Payanam</span>
                </div>
                <button onClick={toggleSidebar} className={styles.toggleBtn}>
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Overlay */}
            <div
                className={`${styles.overlay} ${isSidebarOpen ? styles.visible : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    <Compass size={32} color="var(--primary-light)" />
                    <span>Payanam</span>
                </div>

                <nav className={styles.nav}>
                    <Link to="/dashboard" className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}>
                        <Map size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/explore" className={`${styles.navItem} ${isActive('/explore') ? styles.active : ''}`}>
                        <Globe size={20} />
                        <span>Explore</span>
                    </Link>
                    <Link to="/trips" className={`${styles.navItem} ${isActive('/trips') ? styles.active : ''}`}>
                        <Calendar size={20} />
                        <span>My Trips</span>
                    </Link>
                    <Link to="/create-trip" className={`${styles.navItem} ${isActive('/create-trip') ? styles.active : ''}`}>
                        <PlusCircle size={20} />
                        <span>Plan Trip</span>
                    </Link>
                    <Link to="/profile" className={`${styles.navItem} ${isActive('/profile') ? styles.active : ''}`}>
                        <User size={20} />
                        <span>Profile</span>
                    </Link>
                </nav>

                <div style={{ padding: '0 20px', marginBottom: '10px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: '#aaa', marginLeft: '5px' }}>Currency</span>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}
                        >
                            <option value="INR" style={{ color: 'black' }}>INR (₹)</option>
                            <option value="USD" style={{ color: 'black' }}>USD ($)</option>
                            <option value="EUR" style={{ color: 'black' }}>EUR (€)</option>
                        </select>
                    </div>
                </div>

                <div className={styles.userSection}>
                    <div className={styles.userInfo}>
                        <img src={user?.avatar} alt={user?.name} className={styles.avatar} />
                        <div className={styles.userDetails}>
                            <span className={styles.userName}>{user?.name}</span>
                            <button onClick={logout} className={styles.logoutBtn}>
                                <LogOut size={14} /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            <main className={styles.main}>
                <Outlet />
            </main>

            <ChatWidget />
        </div>
    );
};

export default Layout;
