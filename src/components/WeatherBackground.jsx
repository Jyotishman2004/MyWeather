import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadFull } from "tsparticles";

const WeatherBackground = ({ condition }) => {
  const initParticles = async (engine) => {
    await loadFull(engine);
  };

  // Modern minimalist gradient palettes
  const palettes = {
    'Clear Day': 'linear-gradient(180deg, #1C7ED6 0%, #74C0FC 100%)',
    'Clear Night': 'linear-gradient(180deg, #0B0F19 0%, #1A2A42 100%)',
    'Rain': 'linear-gradient(180deg, #2B3A4A 0%, #4A5C6A 100%)',
    'Thunderstorm': 'linear-gradient(180deg, #181923 0%, #2F3345 100%)',
    'Snow': 'linear-gradient(180deg, #9BB0C1 0%, #D8E3E7 100%)',
    'Fog': 'linear-gradient(180deg, #788A96 0%, #A9BCC8 100%)'
  };

  const bgGradient = palettes[condition] || palettes['Clear Day'];

  const rainSvg = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 30'><rect width='2' height='30' fill='white' opacity='0.6' rx='1'/></svg>`
  )}`;

  const starSvg = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><circle cx='10' cy='10' r='4' fill='white'/><circle cx='10' cy='10' r='10' fill='white' opacity='0.2'/></svg>`
  )}`;

  // Particles config
  const particlesOptions = useMemo(() => {
    if (condition === 'Clear Night') {
      return {
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          number: { value: 150, density: { enable: true, area: 800 } },
          shape: {
            type: "image",
            options: { image: { src: starSvg, width: 20, height: 20 } }
          },
          opacity: {
            value: { min: 0.1, max: 1 },
            animation: { enable: true, speed: 0.5, sync: false }
          },
          size: { value: { min: 2, max: 4 } },
          move: { enable: true, speed: 0.2, direction: "none", outModes: { default: "out" } }
        },
        detectRetina: true
      };
    }

    if (condition === 'Snow') {
      return {
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          number: { value: 150, density: { enable: true, area: 800 } },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: { min: 0.3, max: 0.8 } },
          size: { value: { min: 1, max: 4 } },
          move: { enable: true, speed: 1.5, direction: "bottom", straight: false, outModes: { default: "out" } },
          wobble: { enable: true, distance: 10, speed: 10 }
        },
        detectRetina: true
      };
    }

    if (condition === 'Rain') {
      // Gentle rain
      return {
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          number: { value: 80, density: { enable: true, area: 800 } },
          shape: { type: "image", options: { image: { src: rainSvg, width: 2, height: 30 } } },
          opacity: { value: { min: 0.2, max: 0.5 } },
          size: { value: { min: 1, max: 1.5 } },
          move: { enable: true, speed: 18, direction: "bottom", straight: true, outModes: { default: "out" } },
          rotate: { value: 10, direction: "clockwise", animation: { enable: false } }
        },
        detectRetina: true
      };
    }

    if (condition === 'Thunderstorm') {
      // Heavy rain
      return {
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          number: { value: 200, density: { enable: true, area: 800 } },
          shape: { type: "image", options: { image: { src: rainSvg, width: 2, height: 30 } } },
          opacity: { value: { min: 0.4, max: 0.8 } },
          size: { value: { min: 1, max: 2.5 } },
          move: { enable: true, speed: 28, direction: "bottom", straight: true, outModes: { default: "out" } },
          rotate: { value: 15, direction: "clockwise", animation: { enable: false } }
        },
        detectRetina: true
      };
    }

    return { fullScreen: { enable: false }, particles: { number: { value: 0 } } };
  }, [condition, rainSvg, starSvg]);

  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: -3, // Base gradient is the deepest layer
        overflow: 'hidden',
        background: bgGradient,
        transition: 'background 2s ease-in-out'
      }}
    >
      <AnimatePresence mode="wait">
        {/* Layer 2: Celestial Bodies (Sun / Moon) */}
        {condition === 'Clear Day' && (
          <motion.div
            key="sun-lens-flare"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ position: 'absolute', inset: 0, zIndex: -2 }}
          >
            {/* Core Sun */}
            <motion.div
              style={{
                position: 'absolute', top: '15%', left: '30%',
                width: '120px', height: '120px', borderRadius: '50%',
                background: 'white',
                boxShadow: '0 0 100px 40px rgba(255, 255, 200, 0.8)'
              }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Large Atmospheric Lens Flare */}
            <motion.div
              style={{
                position: 'absolute', top: '-10%', left: '-10%',
                width: '80%', height: '80%', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 235, 150, 0.3) 0%, rgba(255, 200, 100, 0.1) 40%, transparent 70%)',
                mixBlendMode: 'screen', filter: 'blur(40px)'
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}

        {condition === 'Clear Night' && (
          <motion.div
            key="moon"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ position: 'absolute', inset: 0, zIndex: -2 }}
          >
            {/* Crisp Minimalist Moon */}
            <div
              style={{
                position: 'absolute', top: '20%', right: '20%',
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'white',
                boxShadow: '0 0 80px 20px rgba(255, 255, 255, 0.3), inset -15px -15px 20px rgba(0,0,0,0.1)'
              }}
            />
          </motion.div>
        )}

        {/* Layer 3: Minimalist Sky Elements (Clouds / Fog) */}
        {['Clear Day', 'Rain', 'Thunderstorm', 'Snow'].includes(condition) && (
          <motion.div
            key="clouds"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ position: 'absolute', inset: 0, zIndex: -1 }}
          >
            {/* Smooth Capsule Clouds */}
            {[
              { top: '15%', left: '10%', width: '300px', height: '60px', opacity: 0.3, dur: 40 },
              { top: '25%', left: '60%', width: '450px', height: '80px', opacity: 0.2, dur: 55 },
              { top: '10%', left: '80%', width: '200px', height: '40px', opacity: 0.25, dur: 35 }
            ].map((cloud, i) => (
              <motion.div
                key={`cloud-${i}`}
                style={{
                  position: 'absolute',
                  top: cloud.top, left: cloud.left,
                  width: cloud.width, height: cloud.height,
                  borderRadius: '100px', // Creates the sleek capsule shape
                  background: 'white',
                  filter: 'blur(8px)',
                  opacity: cloud.opacity
                }}
                animate={{ x: ['-20%', '100%'] }}
                transition={{ duration: cloud.dur, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </motion.div>
        )}

        {condition === 'Fog' && (
          <motion.div
            key="fog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            style={{ position: 'absolute', inset: 0, zIndex: -1 }}
          >
            {/* Fog Banks */}
            {[
              { top: '40%', height: '60%', blur: '60px', dur: 20 },
              { top: '60%', height: '40%', blur: '40px', dur: 15 }
            ].map((bank, i) => (
              <motion.div
                key={`fog-${i}`}
                style={{
                  position: 'absolute', top: bank.top, left: '-20%', right: '-20%', height: bank.height,
                  background: 'white', opacity: 0.15, filter: `blur(${bank.blur})`, borderRadius: '50%'
                }}
                animate={{ x: ['-5%', '5%', '-5%'] }}
                transition={{ duration: bank.dur, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 4: tsparticles Canvas (Physics Engine) sits right below the UI */}
      <ParticlesProvider init={initParticles}>
        <Particles
          id="tsparticles"
          options={particlesOptions}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
        />
      </ParticlesProvider>

      {/* Thunderstorm Lightning Flashes */}
      {condition === 'Thunderstorm' && (
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'white', mixBlendMode: 'overlay',
            pointerEvents: 'none', zIndex: 10, // Renders over everything
            animation: 'lightning-flash 6s infinite linear'
          }}
        />
      )}

      <style>{`
        @keyframes lightning-flash {
          0%, 100% { opacity: 0; }
          90% { opacity: 0; }
          92% { opacity: 0.8; }
          93% { opacity: 0.1; }
          94% { opacity: 0.9; }
          96% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default WeatherBackground;
