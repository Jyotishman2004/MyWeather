import React from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sunset, Sun, Moon } from 'lucide-react';

const DaylightBar = ({ sunrise, sunset, sunriseTime, sunsetTime, currentTime, condition }) => {
  let progress = 0;
  let remainingText = '';
  
  if (currentTime < sunriseTime) {
    progress = 0;
    const diff = sunriseTime - currentTime;
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    remainingText = `Sunrise in: ${h}h ${m}m`;
  } else if (currentTime > sunsetTime) {
    // Night time: calculate progress from sunset to next sunrise
    const nextSunrise = sunriseTime + 86400;
    const totalNight = nextSunrise - sunsetTime;
    const passedNight = currentTime - sunsetTime;
    progress = Math.min((passedNight / totalNight) * 100, 100);
    
    const diff = nextSunrise - currentTime;
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    remainingText = `Sunrise in: ${h}h ${m}m`;
  } else {
    const totalDaylight = sunsetTime - sunriseTime;
    const passedDaylight = currentTime - sunriseTime;
    progress = Math.min((passedDaylight / totalDaylight) * 100, 100);
    
    const diff = sunsetTime - currentTime;
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    remainingText = `Daylight left: ${h}h ${m}m`;
  }
  
  const isNight = condition === 'Clear Night' || condition === 'Snow' || condition === 'Rain' || condition === 'Thunderstorm' || condition === 'Fog' ? currentTime > sunsetTime || currentTime < sunriseTime : condition === 'Clear Night';

  return (
    <motion.div 
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      style={{
        padding: '2rem 3rem',
        width: '100%',
        margin: '0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.8, fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sunrise size={18} color="#FFB74D" />
          <span>{sunrise}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{sunset}</span>
          <Sunset size={18} color="#FFB74D" />
        </div>
      </div>

      <div style={{ position: 'relative', height: '35px', display: 'flex', alignItems: 'center' }}>
        {/* Track */}
        <div style={{ 
          position: 'absolute', 
          width: '100%', 
          height: '4px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          {/* Fill */}
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: isNight ? 'linear-gradient(90deg, #B39DDB, #7E57C2)' : 'linear-gradient(90deg, #FFB74D, #FF8A65)',
            borderRadius: '2px'
          }} />
        </div>

        {/* Indicator */}
        <motion.div 
          initial={{ left: 0 }}
          animate={{ left: `${progress}%` }}
          transition={{ duration: 1.5, type: 'spring', bounce: 0.2 }}
          style={{ 
            position: 'absolute', 
            transform: 'translateX(-50%)',
            background: isNight ? '#311B92' : '#FFF3E0',
            borderRadius: '50%',
            padding: '0.25rem',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isNight ? <Moon size={20} color="#B39DDB" /> : <Sun size={20} color="#FF8A65" />}
        </motion.div>
      </div>
      
      <div style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.6, marginTop: '-0.5rem' }}>
        {remainingText}
      </div>
    </motion.div>
  );
};

export default DaylightBar;
