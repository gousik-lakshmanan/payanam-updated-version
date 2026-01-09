import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm Payanam Bot. How can I help you plan your trip today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const location = useLocation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        // Context aware greeting if location changes
        if (location.pathname.includes('/trips/')) {
            // Maybe add a message? "I see you're looking at a trip. Need suggestions?"
            // To avoid spam, maybe not automatically add, but the bot "knows".
        }
    }, [location]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Mock AI Response
        setTimeout(() => {
            const responseText = generateResponse(inputValue, location.pathname);
            const botMsg = { id: Date.now() + 1, text: responseText, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const generateResponse = (input, path) => {
        try {
            const lower = input.toLowerCase();
            const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

            // --- CONTEXT EXTRACTION ---
            const cityMatch = input.match(/\b(Goa|Kerala|Manali|Jaipur|Ooty|Coimbatore|Paris|London|Munnar|Udaipur|Rishikesh|Delhi|Mumbai|Chennai|Bangalore|Hyderabad)\b/i);
            const city = cityMatch ? cityMatch[0] : (path.includes('trips') ? 'current destination' : null);

            const budgetMatch = input.match(/\b(budget|cheap|expensive|cost|price|rupees|rs|INR)\b/i);
            const foodMatch = input.match(/\b(food|eat|restaurant|dinner|lunch|breakfast|cafe|drink)\b/i);
            const activityMatch = input.match(/\b(do|visit|see|sightseeing|activity|adventure)\b/i);
            const peopleMatch = input.match(/\b(\d+)\s*(people|pax|persons)|couple|family|solo\b/i);

            // --- INTELLIGENT ROUTING ---

            // 1. SPECIFIC CITY INQUIRIES
            if (city && city !== 'current destination') {
                const cityName = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

                if (foodMatch) {
                    if (cityName === 'Coimbatore') return "For Coimbatore, you must try the Annapoorna Gowrishankar for Sambar Idli. For specific non-veg, Haribhavanam is legendary!";
                    if (cityName === 'Ooty') return "In Ooty, try Earl's Secret for a colonial dining experience, or Place to Bee for organic food. Don't miss the homemade chocolates near the bus stand!";
                    if (cityName === 'Goa') return "Goa is a food paradise! Try Fisherman's Wharf for Goan curry, or Gunpowder for unique regional dishes. For budget eats, the beach shacks are best.";
                    if (cityName === 'Manali') return "Manali has great cafes. Cafe 1947 by the river is iconic. For local Himachali food, try hidden gems in Old Manali.";
                    if (cityName === 'Jaipur') return "Jaipur means Pyaz Kachori at Rawat Mishtan Bhandar. For dinner, Chokhi Dhani offers a complete cultural experience.";
                    return `I know some great food spots in ${cityName}! Are you looking for street food or fine dining?`;
                }

                if (activityMatch) {
                    if (cityName === 'Ooty') return "In Ooty, take a ride on the Nilgiri Mountain Railway, visit the Botanical Gardens, and do boating in Pykara Lake.";
                    if (cityName === 'Coimbatore') return "Visit the Adiyogi Shiva Statue, Marudamalai Temple, and take a drive to Valparai for scenic tea estates.";
                    if (cityName === 'Goa') return "Beyond beaches, visit the Dudhsagar Falls, the Latin Quarter in Panjim, and the historic Fort Aguada.";
                    return `Top things to do in ${cityName} include visiting the main landmarks and exploring local markets. Shall I draft a day plan?`;
                }

                if (budgetMatch) {
                    if (cityName === 'Ooty' || cityName === 'Coimbatore') return `${cityName} is very affordable. A decent hotel is ₹1500-2500, and food for a day can be under ₹500 per person.`;
                    return `Budgeting for ${cityName}? Expect around ₹2000-4000 per day for a comfortable mid-range trip including stay and food.`;
                }

                return `I love ${cityName}! It's a great choice. Ask me about 'food', 'places to see', or 'budget' for ${cityName}.`;
            }

            // 2. CONTEXTUAL HELP (No specific city detected in input)
            if (path.includes('create')) {
                return "I see you are in the Trip Creator. To get the best results, start by typing the destination name (like 'Ooty' or 'Goa') in the input field above!";
            }

            if (lower.includes('suggest') || lower.includes('couple') || lower.includes('family')) {
                const groupType = lower.includes('couple') ? 'couple' : lower.includes('family') ? 'family' : 'group';
                if (groupType === 'couple') return "For couples, I strongly recommend Kerala (Munnar/Alleppey) or a quiet beach in South Goa. Manali is also great for romantic views.";
                if (groupType === 'family') return "Trips with family are best in places like Jaipur (Culture), Ooty (Relaxed), or Singapore (Activities). How many days do you have?";
            }

            // 3. GENERAL FALLBACKS
            if (lower.includes('first time')) {
                return "For a first-time trip, I recommend sticking to popular routes. In South India, Ooty-Mysore-Coorg is a classic loop. In North India, the Golden Triangle never fails.";
            }

            // 4. Greetings
            if (lower.match(/\b(hi|hello|hey|greetings)\b/)) {
                return pick([
                    "Namaste! Where are you planning to travel today?",
                    "Hello! Ready to explore some amazing destinations?",
                    "Hey there! I'm your AI travel buddy. Ask me about trips, budget, or food!"
                ]);
            }

            // Default
            return pick([
                "I can help with itineraries, food spots, or budget tips. Try asking 'Best food in Ooty' or 'Places to visit in Goa'.",
                "That sounds like a plan! Where exactly are you thinking of going?",
                "I'm scanning my travel database... Could you specify which city you are interested in?",
                "I'm here to help you plan. Tell me your destination and budget!"
            ]);

        } catch (error) {
            console.error("AI Error", error);
            return "I'm having trouble connecting to the travel database right now. Please try again.";
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'transform 0.2s'
                }}
                className="hover-scale"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="glass-panel" style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '20px',
                    width: 'calc(100% - 40px)',
                    maxWidth: '350px',
                    height: '500px',
                    maxHeight: '60vh',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    backgroundColor: '#1E1E1E'
                }}>
                    {/* Header */}
                    <div style={{ padding: '16px', background: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sparkles size={18} color="var(--primary)" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>Payanam Bot</div>
                            <div style={{ fontSize: '12px', opacity: 0.8 }}>AI Travel Assistant</div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {messages.map(msg => (
                            <div key={msg.id} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                padding: '10px 14px',
                                borderRadius: '12px',
                                backgroundColor: msg.sender === 'user' ? 'var(--primary-light)' : '#333',
                                color: 'white',
                                borderBottomRightRadius: msg.sender === 'user' ? '2px' : '12px',
                                borderBottomLeftRadius: msg.sender === 'bot' ? '2px' : '12px'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ alignSelf: 'flex-start', padding: '10px', backgroundColor: '#333', borderRadius: '12px', color: '#aaa', fontSize: '12px' }}>
                                Payanam Bot is typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{ padding: '12px', borderTop: '1px solid #333', display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask anything..."
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '20px',
                                border: 'none',
                                background: '#333',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <button onClick={handleSend} style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: 'var(--primary)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
