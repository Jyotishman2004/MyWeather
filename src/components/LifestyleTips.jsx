import React from 'react';
import { motion } from 'framer-motion';
import { Flower2, Umbrella, Droplet, Car, Activity, Map, Bug, Sun, CloudRain, Wind as WindIcon, ThermometerSun, Snowflake, Bike, Star, Dog, ShieldAlert } from 'lucide-react';

const LifestyleTips = ({ weatherData }) => {
  if (!weatherData) return null;
  
  // Extract useful metrics
  const temp = weatherData.temperature;
  const condition = weatherData.condition;
  const isDay = weatherData.icon?.endsWith('d');
  
  const isRaining = condition === 'Rain' || condition === 'Thunderstorm' || condition === 'Drizzle';
  const isSnowing = condition === 'Snow';
  const isFoggy = condition === 'Fog' || condition === 'Mist';
  const isClear = condition === 'Clear';
  
  const uvi = parseInt(weatherData.metrics.uvIndex) || 0;
  
  const windSpeedMatch = typeof weatherData.metrics.wind === 'string' ? weatherData.metrics.wind.match(/(\d+)/) : null;
  const windSpeed = windSpeedMatch ? parseInt(windSpeedMatch[0]) : 0;
  const isWindy = windSpeed > 20;
  
  const humidityMatch = typeof weatherData.metrics.humidity === 'string' ? weatherData.metrics.humidity.match(/(\d+)/) : null;
  const humidity = humidityMatch ? parseInt(humidityMatch[0]) : 0;

  const aqi = weatherData.metrics.airQuality?.aqi || 0;

  // Evaluate scores and dynamic properties.
  // High scores mean the tip is critical for the current weather and will be pushed to the top of the grid!
  const allTips = [
    // 1. UV / Sun
    {
      id: 'uv',
      icon: uvi > 6 ? <Umbrella size={24} color="#EF5350" /> : <Sun size={24} color={uvi > 3 ? "#FFB74D" : "#81C784"} />,
      text: !isDay ? 'Safe UV levels at night' : uvi > 7 ? 'Extreme UV, stay indoors!' : uvi > 4 ? 'High UV, wear sunscreen' : 'Safe UV levels today',
      score: !isDay ? 0 : uvi > 5 ? 120 : uvi > 3 ? 60 : 15 
    },
    // 2. Air Quality
    {
      id: 'aqi',
      icon: <ShieldAlert size={24} color={aqi > 150 ? "#EF5350" : aqi > 100 ? "#FFB74D" : "#81C784"} />,
      text: aqi > 150 ? 'Hazardous air, wear a mask!' : aqi > 100 ? 'Poor air quality, reduce outdoor time' : 'Good air quality today',
      score: aqi > 150 ? 145 : aqi > 100 ? 115 : 10
    },
    // 3. Rain / Umbrella
    {
      id: 'rain',
      icon: isRaining ? <CloudRain size={24} color="#42A5F5" /> : <Umbrella size={24} color="#BDBDBD" />,
      text: isRaining ? 'Bring an umbrella' : 'No rain expected',
      score: isRaining ? 150 : 5
    },
    // 4. Clothing / Temp
    {
      id: 'clothing',
      icon: isSnowing || temp < 5 ? <Snowflake size={24} color="#90CAF9" /> : temp > 30 ? <ThermometerSun size={24} color="#EF5350" /> : <Activity size={24} color="#81C784" />,
      text: temp < 5 ? 'Wear a heavy winter coat' : temp < 15 ? 'Wear a light jacket' : temp > 30 ? 'Wear breathable, light clothes' : 'Comfortable temperature',
      score: temp < 10 || temp > 30 ? 110 : 20
    },
    // 5. Stargazing
    {
      id: 'stargazing',
      icon: <Star size={24} color={!isDay && isClear ? "#FFD54F" : "#BDBDBD"} />,
      text: !isDay && isClear ? 'Perfect night for stargazing!' : 'Poor visibility for stargazing',
      score: !isDay && isClear ? 90 : 0
    },
    // 6. Pets / Dog Walking
    {
      id: 'pets',
      icon: <Dog size={24} color={temp > 30 || temp < -5 || isRaining || isSnowing ? "#EF5350" : "#81C784"} />,
      text: temp > 30 ? 'Too hot for dog paws on asphalt!' : isRaining || isSnowing ? 'Indoor play recommended for pets' : temp < -5 ? 'Too cold for long walks' : 'Great weather to walk your dog',
      score: temp > 30 || temp < -5 || isRaining || isSnowing ? 125 : 45
    },
    // 7. Driving / Roads
    {
      id: 'driving',
      icon: <Map size={24} color={isSnowing ? "#EF5350" : isRaining || isFoggy ? "#FFB74D" : "#81C784"} />,
      text: isSnowing ? 'Icy roads, drive slowly!' : isRaining ? 'Wet roads, maintain safe distance' : isFoggy ? 'Low visibility, use fog lights' : 'Dry roads, safe driving',
      score: isSnowing ? 140 : isFoggy ? 130 : isRaining ? 85 : 10
    },
    // 8. Mosquitoes
    {
      id: 'bugs',
      icon: <Bug size={24} color={temp > 20 && !isRaining && !isWindy ? "#EF5350" : "#BDBDBD"} />,
      text: temp > 20 && !isRaining && !isWindy ? (!isDay ? 'Mosquitoes highly active at night' : 'Mosquitoes are active today') : 'Low bug activity',
      score: temp > 20 && !isRaining && !isWindy ? 70 : 5
    },
    // 9. Wind / Cycling
    {
      id: 'wind',
      icon: isWindy ? <WindIcon size={24} color="#FFB74D" /> : <Bike size={24} color="#81C784" />,
      text: isWindy ? 'Strong winds, avoid cycling' : isRaining || isSnowing ? 'Poor weather for cycling' : 'Great weather for cycling',
      score: isWindy ? 95 : isRaining || isSnowing ? 50 : 25
    },
    // 10. Hydration & Humidity
    {
      id: 'hydration',
      icon: <Droplet size={24} color={temp > 28 || humidity < 30 ? "#42A5F5" : "#BDBDBD"} />,
      text: temp > 28 ? 'High heat, drink plenty of water!' : humidity < 30 ? 'Dry air, use skin moisturizer' : humidity > 80 && temp > 25 ? 'Muggy weather, stay cool' : 'Comfortable humidity levels',
      score: temp > 28 ? 100 : humidity < 30 || (humidity > 80 && temp > 25) ? 95 : 30
    },
    // 11. Pollen / Allergies
    {
      id: 'pollen',
      icon: <Flower2 size={24} color={temp > 15 && isDay && !isRaining && !isSnowing ? "#FFD54F" : "#BDBDBD"} />,
      text: temp > 15 && isDay && !isRaining && !isSnowing ? 'Moderate/High pollen count' : 'Low pollen risk right now',
      score: temp > 15 && isDay && !isRaining && !isSnowing ? 65 : 5
    },
    // 12. Car Wash
    {
      id: 'car',
      icon: <Car size={24} color={isRaining || isSnowing ? "#EF5350" : "#81C784"} />,
      text: isRaining || isSnowing ? 'Do not wash your car' : 'Great day for a car wash',
      score: isRaining || isSnowing ? 80 : 15
    }
  ];

  // Sort by score descending and strictly take the top 9 most important tips to perfectly fill a 3x3 grid!
  const tips = allTips.sort((a, b) => b.score - a.score).slice(0, 9);

  return (
    <motion.div 
      className="glass-panel"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.6 }}
      style={{
        padding: '2rem 3rem',
        width: '100%',
        margin: '2rem 0',
        borderRadius: '40px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 500, opacity: 0.9 }}>Smart Lifestyle Tips</h3>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        rowGap: '2.5rem',
        columnGap: '1rem',
        textAlign: 'center'
      }}>
        {tips.map((tip) => (
          <motion.div 
            key={tip.id}
            whileHover={{ y: -5 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              opacity: 0.85
            }}
          >
            <div style={{ opacity: 0.9 }}>{tip.icon}</div>
            <span style={{ fontSize: '0.85rem', lineHeight: '1.3' }}>{tip.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LifestyleTips;
