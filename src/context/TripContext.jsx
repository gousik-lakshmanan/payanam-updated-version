import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext'; // Import AuthContext

const TripContext = createContext();

export const useTrips = () => useContext(TripContext);

export const TripProvider = ({ children }) => {
    const { user } = useAuth(); // Get current user
    const [trips, setTrips] = useState([]);
    const [currentTrip, setCurrentTrip] = useState(null);
    const [currency, setCurrency] = useState('INR');
    const [loading, setLoading] = useState(false);

    const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/trips`;

    // Helper to get headers
    const getHeaders = () => {
        const token = localStorage.getItem('globeTrotterToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // Fetch Trips when user changes
    useEffect(() => {
        if (user) {
            fetchTrips();
        } else {
            setTrips([]);
            setCurrentTrip(null);
        }
    }, [user]);

    const fetchTrips = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                headers: getHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                setTrips(data);
            }
        } catch (error) {
            console.error("Failed to fetch trips", error);
        } finally {
            setLoading(false);
        }
    };

    const addTrip = async (tripData) => {
        // Optimistic update isn't strictly necessary here as we redirect immediately usually
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(tripData)
            });
            const newTrip = await response.json();
            setTrips(prev => [newTrip, ...prev]);
            return newTrip;
        } catch (error) {
            console.error("Error adding trip", error);
        }
    };

    const updateTrip = async (id, updates) => {
        // Optimistic Update
        setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
        if (currentTrip && currentTrip.id === id) {
            setCurrentTrip(prev => ({ ...prev, ...updates }));
        }

        // API Call
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(updates)
            });
        } catch (error) {
            console.error("Error updating trip", error);
            fetchTrips(); // Revert on error
        }
    };

    const deleteTrip = async (id) => {
        // Optimistic Update
        setTrips(prev => prev.filter(t => t.id !== id));

        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
        } catch (error) {
            console.error("Error deleting trip", error);
            fetchTrips(); // Revert
        }
    };

    const selectTrip = (id) => {
        const trip = trips.find(t => t.id === id);
        setCurrentTrip(trip || null);
        return trip;
    };

    const addActivityToTrip = (tripId, dayDate, activity) => {
        // We reuse the existing logic to calculate the NEW itinerary
        // Then we send that new itinerary to the backend

        const trip = trips.find(t => t.id === tripId);
        if (!trip) return;

        const newItinerary = [...(trip.itinerary || [])];
        let dayIndex = newItinerary.findIndex(d => d.date === dayDate);

        if (dayIndex === -1) {
            newItinerary.push({ date: dayDate, activities: [activity] });
            newItinerary.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
            const isDuplicate = newItinerary[dayIndex].activities.some(act =>
                act.title === activity.title &&
                act.time === activity.time &&
                act.type === activity.type
            );

            if (!isDuplicate) {
                newItinerary[dayIndex].activities.push(activity);
                newItinerary[dayIndex].activities.sort((a, b) => a.time.localeCompare(b.time));
            }
        }

        // Call updateTrip which handles both local state and API
        updateTrip(tripId, { itinerary: newItinerary });
    };

    const deleteActivityFromTrip = (tripId, dayDate, activityId) => {
        const trip = trips.find(t => t.id === tripId);
        if (!trip) return;

        const newItinerary = (trip.itinerary || []).map(day => {
            if (day.date !== dayDate) return day;
            return {
                ...day,
                activities: day.activities.filter(a => a.id !== activityId)
            };
        }).filter(day => day.activities.length > 0 || day.date === trip.startDate);

        updateTrip(tripId, { itinerary: newItinerary });
    };

    // Exchange rates (approximate for demo)
    const rates = {
        INR: 1,
        USD: 0.012,
        EUR: 0.011
    };

    // Symbols
    const currencySymbols = {
        INR: '₹',
        USD: '$',
        EUR: '€'
    };

    const convertCost = (amount) => {
        if (!amount) return 0;
        return Math.round(amount * rates[currency]);
    };

    const value = {
        trips,
        currentTrip,
        addTrip,
        updateTrip,
        deleteTrip,
        selectTrip,
        addActivityToTrip,
        deleteActivityFromTrip,
        currency,
        setCurrency,
        convertCost,
        rates,
        currencySymbol: currencySymbols[currency],
        loading
    };

    return (
        <TripContext.Provider value={value}>
            {children}
        </TripContext.Provider>
    );
};
