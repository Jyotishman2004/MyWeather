import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Wind, Gauge, Eye, Sun } from 'lucide-react';
import AirQualityPanel from './AirQualityPanel';

const metricIcons = {
  humidity: { icon: Droplets, color: "#40E0D0" },
  wind: { icon: Wind, color: "#A0E0FF" },
  pressure: { icon: Gauge, color: "#B39DDB" },
  visibility: { icon: Eye, color: "#FFD54F" },
  uvIndex: { icon: Sun, color: "#FF8A65" }
};

const metricLabels = {
  humidity: 'Humidity',
  wind: 'Wind',
  pressure: 'Pressure',
  visibility: 'Visibility',
  uvIndex: 'UV Index'
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.6
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const WeatherMetrics = ({ metrics, sunrise, sunset, sunriseTime, sunsetTime, currentTime, condition, airQuality }) => {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="metrics-grid"
    >
      {Object.entries(metrics).map(([key, value]) => {
        const { icon: Icon, color } = metricIcons[key];
        return (
          <motion.div 
            key={key} 
            variants={item}
            className="glass-card"
            style={{
              padding: '1.25rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              borderTop: `2px solid ${color}40`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8, fontSize: '0.85rem' }}>
              <Icon size={18} color={color} />
              <span>{metricLabels[key]}</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 500 }}>
              {value}
            </div>
          </motion.div>
        );
      })}
      
      {/* AirQualityPanel rendered as a grid tile */}
      <motion.div variants={item} style={{ height: '100%' }}>
        <AirQualityPanel airQuality={airQuality} />
      </motion.div>
    </motion.div>
  );
};

export default WeatherMetrics;
