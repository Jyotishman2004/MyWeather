import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Cloud, CloudRain, CloudSun, CloudMoon, CloudSunRain, CloudMoonRain, CloudLightning, Snowflake, Wind } from 'lucide-react';

const getIcon = (iconName) => {
  switch (iconName) {
    case 'sun': return <Sun size={36} color="#FFD54F" />;
    case 'moon': return <Moon size={36} color="#B39DDB" />;
    case 'cloud': return <Cloud size={36} color="#E0E0E0" />;
    case 'cloud-sun': return <CloudSun size={36} color="#FFB74D" />;
    case 'cloud-moon': return <CloudMoon size={36} color="#B39DDB" />;
    case 'cloud-rain': return <CloudRain size={36} color="#64B5F6" />;
    case 'cloud-sun-rain': return <CloudSunRain size={36} color="#64B5F6" />;
    case 'cloud-moon-rain': return <CloudMoonRain size={36} color="#64B5F6" />;
    case 'cloud-lightning': return <CloudLightning size={36} color="#9575CD" />;
    case 'snowflake': return <Snowflake size={36} color="#90CAF9" />;
    case 'wind': return <Wind size={36} color="#B0BEC5" />;
    default: return <Sun size={36} color="#FFD54F" />;
  }
};

const HourlyForecast = ({ hourly }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      style={{ width: '100%' }}
    >
      <div className="glass-panel hourly-panel" style={{ overflow: 'hidden', width: '100%' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.75rem', opacity: 0.8, textAlign: 'center' }}>Hourly Forecast</h3>
        <div 
          className="hourly-scroll"
          style={{
            display: 'flex',
            gap: '0.25rem',
            paddingTop: '0.25rem',
            paddingBottom: '0.5rem',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {hourly.map((hour, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '72px',
                flex: '0 0 auto',
                padding: '0.25rem 0',
              }}
            >
              <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>{hour.time}</span>
              <div style={{ padding: '0.35rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>
                {getIcon(hour.icon)}
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 500 }}>{hour.temp}&deg;</span>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .hourly-panel {
          padding: 1.25rem 4rem;
        }
        .hourly-scroll {
          justify-content: space-around;
        }
        .hourly-scroll > div {
          flex: 1 1 0 !important;
          min-width: 0 !important;
        }
        .hourly-scroll::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 768px) {
          .hourly-panel {
            padding: 1rem 1rem;
            border-radius: 24px;
          }
          .hourly-scroll {
            justify-content: flex-start;
          }
          .hourly-scroll > div {
            flex: 0 0 auto !important;
            min-width: 72px !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default HourlyForecast;
