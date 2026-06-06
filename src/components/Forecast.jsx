import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Cloud, CloudRain, CloudSun, CloudMoon, CloudSunRain, CloudMoonRain, CloudLightning, Snowflake, Wind } from 'lucide-react';

const getIcon = (iconName) => {
  switch (iconName) {
    case 'sun': return <Sun size={28} color="#FFD54F" />;
    case 'moon': return <Moon size={28} color="#B39DDB" />;
    case 'cloud': return <Cloud size={28} color="#E0E0E0" />;
    case 'cloud-sun': return <CloudSun size={28} color="#FFB74D" />;
    case 'cloud-moon': return <CloudMoon size={28} color="#B39DDB" />;
    case 'cloud-rain': return <CloudRain size={28} color="#64B5F6" />;
    case 'cloud-sun-rain': return <CloudSunRain size={28} color="#64B5F6" />;
    case 'cloud-moon-rain': return <CloudMoonRain size={28} color="#64B5F6" />;
    case 'cloud-lightning': return <CloudLightning size={28} color="#9575CD" />;
    case 'snowflake': return <Snowflake size={28} color="#90CAF9" />;
    case 'wind': return <Wind size={28} color="#B0BEC5" />;
    default: return <Sun size={28} color="#FFD54F" />;
  }
};

const Forecast = ({ daily }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const visibleDays = isExpanded ? daily : daily.slice(0, 6);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        width: '100%',
        margin: '0'
      }}
    >
      {/* Multi-Day Forecast */}
      <div className="glass-panel pill-panel-forecast">
        <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1.5rem', opacity: 0.8, textAlign: 'center' }}>Multi-Day Forecast</h3>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem'
        }}>
          {visibleDays.map((day, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                borderRadius: '12px',
                transition: 'background 0.3s'
              }}
            >
              <span style={{ width: '60px', fontWeight: day.day === 'Today' ? 600 : 400 }}>{day.day}</span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '80px', opacity: 0.8 }}>
                {getIcon(day.icon)}
                {day.precipitation !== '0%' && (
                  <span style={{ fontSize: '0.75rem', color: '#90D5EC' }}>{day.precipitation}</span>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100px', justifyContent: 'flex-end' }}>
                <span style={{ opacity: 0.6 }}>{day.low}&deg;</span>
                <div style={{ flex: 1, height: '6px', background: 'rgba(0,0,0,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #42A5F5 0%, #66BB6A 50%, #EF5350 100%)',
                    width: `${((day.high - day.low) / 25) * 100}%`,
                    marginLeft: `${((day.low - 0) / 35) * 100}%`,
                    borderRadius: '3px'
                  }}></div>
                </div>
                <span style={{ fontWeight: 500 }}>{day.high}&deg;</span>
              </div>
            </motion.div>
          ))}
          
          {daily.length > 6 && (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                textAlign: 'center',
                padding: '0.75rem',
                marginTop: '0.5rem',
                cursor: 'pointer',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                fontSize: '0.9rem',
                fontWeight: 500,
                opacity: 0.8,
                transition: 'background 0.3s'
              }}
            >
              {isExpanded ? 'View Less' : 'View 16-Day Forecast'}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Forecast;
