import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const getAqiColor = (aqi) => {
  if (aqi <= 50) return '#4CAF50'; // Good
  if (aqi <= 100) return '#FFEB3B'; // Moderate
  if (aqi <= 150) return '#FF9800'; // Unhealthy for Sensitive
  if (aqi <= 200) return '#F44336'; // Unhealthy
  if (aqi <= 300) return '#9C27B0'; // Very Unhealthy
  return '#B71C1C'; // Hazardous
};

const AirQualityPanel = ({ airQuality }) => {
  if (!airQuality) return null;

  const color = getAqiColor(airQuality.aqi);
  
  // Calculate non-linear progress to match evenly spaced labels (0, 50, 100, 150, 200, 300, 500)
  // There are 6 segments, each taking 1/6 (16.66%) of the visual width.
  const aqi = airQuality.aqi;
  let progress = 0;
  if (aqi <= 50) {
    progress = (aqi / 50) * (100 / 6);
  } else if (aqi <= 100) {
    progress = (100 / 6) + ((aqi - 50) / 50) * (100 / 6);
  } else if (aqi <= 150) {
    progress = (200 / 6) + ((aqi - 100) / 50) * (100 / 6);
  } else if (aqi <= 200) {
    progress = (300 / 6) + ((aqi - 150) / 50) * (100 / 6);
  } else if (aqi <= 300) {
    progress = (400 / 6) + ((aqi - 200) / 100) * (100 / 6);
  } else {
    progress = (500 / 6) + (Math.min(aqi - 300, 200) / 200) * (100 / 6);
  }

  return (
    <motion.div 
      className="glass-card"
      style={{
        padding: '1.25rem 2rem',
        width: '100%',
        height: '100%',
        margin: '0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '0.75rem',
        borderTop: `2px solid ${color}40`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8, fontSize: '0.85rem' }}>
          <Activity size={18} color={color} />
          <span>Air Quality</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: color }}>
            {airQuality.aqi}
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ 
          height: '100%', 
          background: 'linear-gradient(90deg, #4CAF50 0%, #4CAF50 16.66%, #FFEB3B 33.33%, #FF9800 50%, #F44336 66.66%, #9C27B0 83.33%, #B71C1C 100%)',
          width: '100%' 
        }} />
        <motion.div 
          initial={{ left: 0 }}
          animate={{ left: `${progress}%` }}
          transition={{ duration: 1.5, type: 'spring', bounce: 0.2 }}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '4px',
            background: '#fff',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            transform: 'translateX(-50%)'
          }}
        />
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 500, color: color }}>
        {airQuality.label}
      </div>
    </motion.div>
  );
};

export default AirQualityPanel;
