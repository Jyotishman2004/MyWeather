import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Bookmark } from 'lucide-react';
import { fetchCitySuggestions } from '../services/weatherService';

const SearchBar = ({ onSearch, onLocationSearch, savedLocations = [] }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setIsTyping(true);
    debounceRef.current = setTimeout(async () => {
      const results = await fetchCitySuggestions(query);
      setSuggestions(results);
      setIsTyping(false);
    }, 500); // 500ms debounce
    
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setSuggestions([]);
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setSuggestions([]);
    setIsFocused(false);
    // OpenWeather search works best with "City, Country"
    onSearch(`${suggestion.name}, ${suggestion.country}`);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationSearch(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          alert('Unable to retrieve your location. Please check browser permissions.');
          console.error(error);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '2rem auto 0 auto', position: 'relative', zIndex: 50 }}>
      <motion.div 
        className="glass-card"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.75rem 1.25rem',
          width: '100%',
        }}
      >
        <div onClick={handleSubmit} style={{ cursor: 'pointer', display: 'flex' }}>
          <Search size={20} color={isFocused ? "#fff" : "rgba(255,255,255,0.6)"} style={{ transition: 'color 0.3s' }} />
        </div>
        
        <form onSubmit={handleSubmit} style={{ flex: 1, marginLeft: '0.75rem' }}>
          <input 
            type="text" 
            placeholder="Search city..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay hiding suggestions so click event on suggestion can fire
              setTimeout(() => setIsFocused(false), 200);
            }}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
        </form>
        
        <div onClick={handleLocationClick} style={{ cursor: 'pointer', display: 'flex', marginLeft: '0.5rem' }}>
          <MapPin size={20} color="rgba(255,255,255,0.6)" style={{ transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color='#fff'} onMouseOut={(e) => e.target.style.color='rgba(255,255,255,0.6)'}/>
        </div>
        
        <style>{`
          input::placeholder {
            color: rgba(255,255,255,0.5);
          }
        `}</style>
      </motion.div>

      {/* Auto-suggestions Dropdown */}
      <AnimatePresence>
        {isFocused && (suggestions.length > 0 || isTyping || (query.trim() === '' && savedLocations.length > 0)) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '0.5rem',
              padding: '0.5rem',
              maxHeight: '250px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              borderRadius: '24px'
            }}
          >
            {query.trim() === '' ? (
              <>
                <div style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', opacity: 0.6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Saved Locations
                </div>
                {savedLocations.map((loc, idx) => (
                  <div 
                    key={`saved-${idx}`}
                    onClick={() => {
                      onSearch(loc);
                      setIsFocused(false);
                    }}
                    style={{ 
                      padding: '0.75rem 1rem', 
                      cursor: 'pointer', 
                      borderRadius: '8px',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Bookmark size={16} fill="#FBBF24" color="#FBBF24" />
                    <span style={{ fontWeight: 500 }}>{loc}</span>
                  </div>
                ))}
              </>
            ) : isTyping && suggestions.length === 0 ? (
              <div style={{ padding: '0.75rem', opacity: 0.6, fontSize: '0.9rem', textAlign: 'center' }}>Searching...</div>
            ) : (
              suggestions.map((s, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSuggestionClick(s)}
                  style={{ 
                    padding: '0.75rem 1rem', 
                    cursor: 'pointer', 
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontWeight: 500 }}>{s.name}</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                    {s.state ? `${s.state}, ` : ''}{s.country}
                  </span>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
