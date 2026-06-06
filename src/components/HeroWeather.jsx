import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';

const HeroWeather = ({ data, isSaved, onToggleSave }) => {
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
        padding: '3rem 1rem',
        marginTop: '2rem'
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
          textShadow: '0 10px 30px rgba(0,0,0,0.1)'
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
    </motion.div>
  );
};

export default HeroWeather;
