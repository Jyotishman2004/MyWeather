import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadFull } from "tsparticles";

const WeatherBackground = ({ condition, isNight }) => {
  const initParticles = async (engine) => {
    await loadFull(engine);
  };

  const particleColor = isNight ? '#FFFFFF' : '#1A1A1A';

  // Subtle flat overlays
  const palettes = {
    'Clear Day': 'rgba(28, 126, 214, 0.05)',
    'Clear Night': 'rgba(255, 255, 255, 0.02)',
    'Rain': 'rgba(74, 92, 106, 0.1)',
    'Thunderstorm': 'rgba(47, 51, 69, 0.15)',
    'Snow': 'rgba(216, 227, 231, 0.2)',
    'Fog': 'rgba(169, 188, 200, 0.15)'
  };

  const bgOverlay = palettes[condition] || palettes['Clear Day'];

  const rainSvg = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 30'><rect width='2' height='30' fill='${particleColor}' opacity='0.3' rx='1'/></svg>`
  )}`;

  const starSvg = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><circle cx='10' cy='10' r='4' fill='${particleColor}'/><circle cx='10' cy='10' r='10' fill='${particleColor}' opacity='0.2'/></svg>`
  )}`;

  // Particles config
  const particlesOptions = useMemo(() => {
    if (condition === 'Clear Night') {
      return {
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          number: { value: 60, density: { enable: true, area: 800 } },
          shape: {
            type: "image",
            options: { image: { src: starSvg, width: 20, height: 20 } }
          },
          opacity: {
            value: { min: 0.05, max: 0.3 },
            animation: { enable: true, speed: 0.2, sync: false }
          },
          size: { value: { min: 2, max: 4 } },
          move: { enable: true, speed: 0.1, direction: "none", outModes: { default: "out" } }
        },
        detectRetina: true
      };
    }

    if (condition === 'Snow') {
      return {
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          number: { value: 80, density: { enable: true, area: 800 } },
          color: { value: particleColor },
          shape: { type: "circle" },
          opacity: { value: { min: 0.1, max: 0.4 } },
          size: { value: { min: 1, max: 3 } },
          move: { enable: true, speed: 1, direction: "bottom", straight: false, outModes: { default: "out" } },
          wobble: { enable: true, distance: 10, speed: 10 }
        },
        detectRetina: true
      };
    }

    if (condition === 'Rain') {
      return {
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          number: { value: 60, density: { enable: true, area: 800 } },
          shape: { type: "image", options: { image: { src: rainSvg, width: 2, height: 30 } } },
          opacity: { value: { min: 0.1, max: 0.3 } },
          size: { value: { min: 1, max: 1.5 } },
          move: { enable: true, speed: 12, direction: "bottom", straight: true, outModes: { default: "out" } },
          rotate: { value: 10, direction: "clockwise", animation: { enable: false } }
        },
        detectRetina: true
      };
    }

    if (condition === 'Thunderstorm') {
      return {
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          number: { value: 120, density: { enable: true, area: 800 } },
          shape: { type: "image", options: { image: { src: rainSvg, width: 2, height: 30 } } },
          opacity: { value: { min: 0.2, max: 0.5 } },
          size: { value: { min: 1, max: 2 } },
          move: { enable: true, speed: 20, direction: "bottom", straight: true, outModes: { default: "out" } },
          rotate: { value: 15, direction: "clockwise", animation: { enable: false } }
        },
        detectRetina: true
      };
    }

    return { fullScreen: { enable: false }, particles: { number: { value: 0 } } };
  }, [condition, rainSvg, starSvg, particleColor]);

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: '0', left: '0', right: '0', bottom: '0',
        zIndex: 0,
        overflow: 'hidden',
        background: bgOverlay,
        transition: 'background 1s ease-in-out',
        pointerEvents: 'none'
      }}
    >
      <AnimatePresence mode="wait">
        {condition === 'Clear Day' && (
          <motion.div
            key="flat-sun"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ position: 'absolute', inset: 0, zIndex: -2 }}
          >
            <div
              style={{
                position: 'absolute', top: '15%', left: '15%',
                width: '120px', height: '120px', borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}
            />
          </motion.div>
        )}

        {condition === 'Clear Night' && (
          <motion.div
            key="flat-moon"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ position: 'absolute', inset: 0, zIndex: -2 }}
          >
            <div
              style={{
                position: 'absolute', top: '15%', right: '15%',
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'transparent',
                border: `2px solid ${particleColor}`,
                opacity: 0.15
              }}
            />
          </motion.div>
        )}

        {['Clear Day', 'Rain', 'Thunderstorm', 'Snow'].includes(condition) && (
          <motion.div
            key="flat-clouds"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ position: 'absolute', inset: 0, zIndex: -1 }}
          >
            {[
              { top: '10%', left: '10%', width: '300px', height: '60px', opacity: 0.05, dur: 60 },
              { top: '25%', left: '60%', width: '450px', height: '80px', opacity: 0.03, dur: 80 },
              { top: '15%', left: '80%', width: '200px', height: '40px', opacity: 0.04, dur: 50 }
            ].map((cloud, i) => (
              <motion.div
                key={`cloud-${i}`}
                style={{
                  position: 'absolute',
                  top: cloud.top, left: cloud.left,
                  width: cloud.width, height: cloud.height,
                  borderRadius: '100px',
                  background: particleColor,
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
            key="flat-fog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            style={{ position: 'absolute', inset: 0, zIndex: -1 }}
          >
            <div
              style={{
                position: 'absolute', top: '40%', left: '-20%', right: '-20%', height: '60%',
                background: particleColor, opacity: 0.05, filter: 'blur(10px)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ParticlesProvider init={initParticles}>
        <Particles
          key={condition}
          id="tsparticles"
          options={particlesOptions}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
        />
      </ParticlesProvider>

      {condition === 'Thunderstorm' && (
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundColor: particleColor,
            pointerEvents: 'none', zIndex: 10,
            animation: 'lightning-flash 6s infinite linear'
          }}
        />
      )}

      <style>{`
        @keyframes lightning-flash {
          0%, 100% { opacity: 0; }
          90% { opacity: 0; }
          92% { opacity: 0.3; }
          93% { opacity: 0.05; }
          94% { opacity: 0.4; }
          96% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default WeatherBackground;
