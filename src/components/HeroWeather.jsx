import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';

const generateInsight = (data) => {
  if (!data) return '';
  const temp = data.temperature;
  const feelsLike = data.feelsLike;
  const condition = data.condition || '';
  
  const isRaining = condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle');
  const isSnowing = condition.toLowerCase().includes('snow');
  const isClear = condition.toLowerCase().includes('clear');
  
  const humidityMatch = typeof data.metrics?.humidity === 'string' ? data.metrics.humidity.match(/(\d+)/) : null;
  const humidity = humidityMatch ? parseInt(humidityMatch[0]) : 50;
  
  const windMatch = typeof data.metrics?.wind === 'string' ? data.metrics.wind.match(/(\d+)/) : null;
  const wind = windMatch ? parseInt(windMatch[0]) : 0;
  
  // 1. What it feels like
  let tempDesc = '';
  if (temp > 30) tempDesc = feelsLike > temp ? "It's scorching hot and feels even hotter due to humidity." : "It's a very hot day.";
  else if (temp > 20) tempDesc = feelsLike > temp + 2 ? "Warm and humid conditions make it feel warmer than it actually is." : "It's comfortably warm out.";
  else if (temp > 10) tempDesc = wind > 20 ? "It's mild, but strong winds make it feel cooler." : "It's pleasantly cool right now.";
  else if (temp > 0) tempDesc = feelsLike < temp - 3 ? "It's chilly, and the wind chill makes it feel noticeably colder." : "It's quite chilly out.";
  else tempDesc = "Freezing temperatures out there.";

  // 2. What to expect
  let expectDesc = '';
  if (isRaining) expectDesc = "Expect wet conditions to continue. ";
  else if (isSnowing) expectDesc = "Expect snowy conditions. ";
  else if (isClear) expectDesc = "Enjoy the clear skies today. ";
  else expectDesc = `Expect mostly ${condition.toLowerCase()} skies. `;

  // 3. Actionable recommendation
  let actionDesc = '';
  if (temp > 28) actionDesc = "Keep hydrated and consider light clothing if spending time outdoors.";
  else if (isRaining) actionDesc = "Don't forget your umbrella and drive safely.";
  else if (isSnowing) actionDesc = "Bundle up warmly and watch for ice.";
  else if (temp < 10) actionDesc = "A warm jacket is highly recommended.";
  else if (humidity > 80) actionDesc = "Wear light, breathable clothing.";
  else actionDesc = "A great day for outdoor activities!";

  return `${tempDesc} ${expectDesc}${actionDesc}`;
};

const HeroWeather = ({ data, isSaved, onToggleSave }) => {
  const insight = generateInsight(data);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '1rem 1rem 1.5rem',
        marginTop: '0.5rem',
        textShadow: '0 2px 10px rgba(0,0,0,0.4)'
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 400, opacity: 0.9, margin: 0 }}>
          {data.location}
        </h2>
        <button 
          onClick={onToggleSave}
          title={isSaved ? "Remove from Saved" : "Save Location"}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            color: isSaved ? '#FBBF24' : 'rgba(255,255,255,0.4)',
            transition: 'color 0.2s',
          }}
          onMouseOver={(e) => { if(!isSaved) e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
          onMouseOut={(e) => { if(!isSaved) e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
        >
          <Bookmark size={20} fill={isSaved ? '#FBBF24' : 'none'} />
        </button>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ 
          fontSize: 'clamp(6rem, 15vw, 10rem)', 
          fontWeight: 200, 
          lineHeight: 1, 
          letterSpacing: '-0.05em',
          textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.3)'
        }}
      >
        {data.temperature}&deg;
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ 
          fontSize: '1.25rem', 
          fontWeight: 500,
          marginTop: '0.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}
      >
        <span>{data.condition}</span>
        <span style={{ opacity: 0.5, fontSize: '0.9em' }}>|</span>
        <span>H: {data.high}&deg; L: {data.low}&deg;</span>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        style={{
          marginTop: '0.5rem',
          fontSize: '1rem',
          opacity: 0.8,
          fontWeight: 400
        }}
      >
        Feels like {data.feelsLike}&deg;
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: '1.5rem',
          fontSize: '0.9rem',
          opacity: 0.7,
          fontWeight: 300
        }}
      >
        {data.date}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          marginTop: '1.5rem',
          padding: '0.5rem 1.25rem',
          background: 'rgba(0, 0, 0, 0.15)',
          borderRadius: '9999px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          maxWidth: '600px'
        }}
      >
        <span style={{ fontSize: '0.85rem', lineHeight: '1.4', opacity: 0.8, fontStyle: 'italic', fontWeight: 300 }}>
          "{insight}"
        </span>
      </motion.div>
    </motion.div>
  );
};

export default HeroWeather;
