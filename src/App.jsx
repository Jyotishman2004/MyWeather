import React, { useState, useEffect } from 'react';
import './index.css';
import './styles/themes.css';
import { mockWeatherData } from './mockData';
import { fetchWeatherData, fetchWeatherByCoords } from './services/weatherService';

import WeatherBackground from './components/WeatherBackground';
import SearchBar from './components/SearchBar';
import HeroWeather from './components/HeroWeather';
import WeatherMetrics from './components/WeatherMetrics';
import HourlyForecast from './components/HourlyForecast';
import DaylightBar from './components/DaylightBar';
import Forecast from './components/Forecast';
import LifestyleTips from './components/LifestyleTips';
import WeatherMap from './components/WeatherMap';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedLocations, setSavedLocations] = useState(() => {
    const saved = localStorage.getItem('weatherApp_savedLocations');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleSaveLocation = (locationName) => {
    let newSaved;
    if (savedLocations.includes(locationName)) {
      newSaved = savedLocations.filter(loc => loc !== locationName);
    } else {
      newSaved = [...savedLocations, locationName];
    }
    setSavedLocations(newSaved);
    localStorage.setItem('weatherApp_savedLocations', JSON.stringify(newSaved));
  };

  const handleSearch = async (query) => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(query);
      setWeatherData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch weather data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSearch = async (lat, lon) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCoords(lat, lon);
      setWeatherData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch weather for your location.');
    } finally {
      setIsLoading(false);
    }
  };

  const isNight = weatherData ?
    (weatherData.condition.includes('Night') || weatherData.currentTime < weatherData.sunriseTime || weatherData.currentTime > weatherData.sunsetTime)
    : false;

  return (
    <div className={isNight ? 'night-mode' : ''} style={{ position: 'relative', minHeight: '100dvh', width: '100%', overflowX: 'hidden', backgroundColor: 'var(--paper-bg)', color: 'var(--paper-text)', transition: 'background-color 0.5s ease, color 0.5s ease' }}>
      <WeatherBackground condition={weatherData?.condition || 'Clear'} isNight={isNight} />

      <main style={{ position: 'relative', zIndex: 10, padding: '1rem 4%', maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <SearchBar
          onSearch={handleSearch}
          onLocationSearch={handleLocationSearch}
          savedLocations={savedLocations}
        />

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(255, 0, 0, 0.2)', color: 'white', borderRadius: '12px', textAlign: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'white' }}>
            <div className="spinner"></div>
            <span style={{ marginLeft: '1rem', fontSize: '1.2rem' }}>Loading Weather...</span>
            <style>{`
              .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(255,255,255,0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
              }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        ) : !weatherData ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
            <div className="paper-card" style={{ padding: '3rem', maxWidth: '500px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '600' }}>Welcome to Atmos</h2>
              <p style={{ opacity: 0.8, fontSize: '1.1rem', lineHeight: '1.5' }}>
                Enter a city name above or click the location icon to check the current weather and forecasts for your area.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Top Fold: Hero, Hourly, Multi-day Forecast */}
            <div className="dashboard-layout top-fold">
              <div className="dashboard-main" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}>
                <div className="paper-card" style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <HeroWeather
                    data={weatherData}
                    isSaved={savedLocations.includes(weatherData.location)}
                    onToggleSave={() => toggleSaveLocation(weatherData.location)}
                  />
                </div>
                <HourlyForecast hourly={weatherData.hourly} />
              </div>

              <div className="dashboard-sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ flex: 1, display: 'flex' }}>
                  <Forecast daily={weatherData.daily} />
                </div>
              </div>
            </div>

            {/* Bottom Fold: Metrics, Map, Daylight, Lifestyle */}
            <div className="dashboard-layout bottom-fold">
              <div className="dashboard-main" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <WeatherMetrics
                  metrics={weatherData.metrics}
                  sunrise={weatherData.sunrise}
                  sunset={weatherData.sunset}
                  sunriseTime={weatherData.sunriseTime}
                  sunsetTime={weatherData.sunsetTime}
                  currentTime={weatherData.currentTime}
                  condition={weatherData.condition}
                  airQuality={weatherData.airQuality}
                />

                <DaylightBar
                  sunrise={weatherData.sunrise}
                  sunset={weatherData.sunset}
                  sunriseTime={weatherData.sunriseTime}
                  sunsetTime={weatherData.sunsetTime}
                  currentTime={weatherData.currentTime}
                  condition={weatherData.condition}
                />

                <WeatherMap
                  lat={weatherData.lat}
                  lon={weatherData.lon}
                  onLocationClick={handleLocationSearch}
                  locationName={weatherData.location}
                />
              </div>

              <div className="dashboard-sidebar">
                <LifestyleTips weatherData={weatherData} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
