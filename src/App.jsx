import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import ItineraryView from './pages/ItineraryView';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import CitySearch from './pages/CitySearch';
import MonthlySummary from './pages/MonthlySummary';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While loading auth state, maybe show a spinner or nothing
  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Payanam...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <TripProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="trips" element={<MyTrips />} />
              <Route path="explore" element={<CitySearch />} />
              <Route path="trips/:tripId" element={<ItineraryView />} />
              <Route path="create-trip" element={<CreateTrip />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin" element={<Admin />} />
              <Route path="monthly-summary" element={<MonthlySummary />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </TripProvider>
    </AuthProvider>
  );
};

export default App;
