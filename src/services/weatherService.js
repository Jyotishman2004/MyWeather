const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Map OpenWeather condition codes to our cinematic themes
const mapConditionToTheme = (weatherId, iconCode) => {
  const isDay = iconCode.endsWith('d');
  
  if (weatherId >= 200 && weatherId < 300) return 'Thunderstorm';
  if (weatherId >= 300 && weatherId < 600) return 'Rain';
  if (weatherId >= 600 && weatherId < 700) return 'Snow';
  if (weatherId >= 700 && weatherId < 800) return 'Fog';
  if (weatherId === 800) return isDay ? 'Clear Day' : 'Clear Night';
  
  // Clouds (801-804) - map to clear day/night since our hybrid background renders clouds anyway
  return isDay ? 'Clear Day' : 'Clear Night'; 
};

// Map OpenWeather condition codes to our forecast icons
const mapConditionToIcon = (weatherId, iconCode) => {
  // First, explicitly check day/night to ensure consistency
  const isDay = iconCode ? iconCode.endsWith('d') : true;
  
  // Thunderstorm, Snow, and Mist have neutral icons
  if (weatherId >= 200 && weatherId < 300) return 'cloud-lightning';
  if (weatherId >= 600 && weatherId < 700) return 'snowflake';
  if (weatherId >= 700 && weatherId < 800) return 'wind';
  
  // For Clear, Clouds, and Rain, ALWAYS use a day/night specific variant
  if (weatherId === 800) return isDay ? 'sun' : 'moon';
  if (weatherId > 800) return isDay ? 'cloud-sun' : 'cloud-moon';
  if (weatherId >= 300 && weatherId < 600) return isDay ? 'cloud-sun-rain' : 'cloud-moon-rain';
  
  return isDay ? 'sun' : 'moon';
};

const formatTime = (unixTimestamp, timezoneOffset) => {
  const date = new Date((unixTimestamp + timezoneOffset) * 1000);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
};

const formatHour = (unixTimestamp, timezoneOffset) => {
  const date = new Date((unixTimestamp + timezoneOffset) * 1000);
  let hours = date.getUTCHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours} ${ampm}`;
};

const getConditionName = (weatherId) => {
  if (weatherId >= 200 && weatherId < 300) return 'Thunderstorm';
  if (weatherId >= 300 && weatherId < 400) return 'Drizzle';
  if (weatherId >= 500 && weatherId < 600) return 'Rain';
  if (weatherId >= 600 && weatherId < 700) return 'Snow';
  if (weatherId >= 700 && weatherId < 800) return 'Mist';
  if (weatherId === 800) return 'Clear';
  if (weatherId > 800) return 'Clouds';
  return 'Unknown';
};

const getWindDirection = (degrees) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 45) % 8;
  return directions[index];
};

const getUviLabel = (value) => {
  if (value <= 2) return 'Low';
  if (value <= 5) return 'Moderate';
  if (value <= 7) return 'High';
  if (value <= 10) return 'Very High';
  return 'Extreme';
};

const calculateUS_AQI = (pm25) => {
  let c = pm25;
  if (c <= 12.0) return Math.round((50 - 0) / (12.0 - 0.0) * (c - 0.0) + 0);
  if (c <= 35.4) return Math.round((100 - 51) / (35.4 - 12.1) * (c - 12.1) + 51);
  if (c <= 55.4) return Math.round((150 - 101) / (55.4 - 35.5) * (c - 35.5) + 101);
  if (c <= 150.4) return Math.round((200 - 151) / (150.4 - 55.5) * (c - 55.5) + 151);
  if (c <= 250.4) return Math.round((300 - 201) / (250.4 - 150.5) * (c - 150.5) + 201);
  if (c <= 350.4) return Math.round((400 - 301) / (350.4 - 250.5) * (c - 250.5) + 301);
  if (c <= 500.4) return Math.round((500 - 401) / (500.4 - 350.5) * (c - 350.5) + 401);
  return 500;
};

const mapOpenMeteoCodeToIcon = (code) => {
  if (code === 0) return 'sun';
  if (code === 1 || code === 2) return 'cloud-sun';
  if (code === 3 || code === 45 || code === 48) return 'cloud';
  return 'cloud-rain';
};

const getAqiLabel = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

const processWeatherData = async (currentRes, forecastRes) => {
  if (!currentRes.ok) {
    throw new Error(`Location not found (${currentRes.status})`);
  }
  const currentData = await currentRes.json();
  const forecastData = await forecastRes.json();

  const timezone = currentData.timezone;

  // Fetch UV Index (Real-time)
  let uviValue = "0 Low";
  try {
    const uviRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${currentData.coord.lat}&longitude=${currentData.coord.lon}&current=uv_index`);
    if (uviRes.ok) {
      const uviData = await uviRes.json();
      const uv = uviData.current ? uviData.current.uv_index : 0;
      
      // Safety check: UV is exactly 0 if it's night time
      const isNight = currentData.dt < currentData.sys.sunrise || currentData.dt > currentData.sys.sunset;
      const finalUv = isNight ? 0 : Math.round(uv);
      
      uviValue = `${finalUv} ${getUviLabel(finalUv)}`;
    }
  } catch (e) {
    console.error("Failed to fetch UVI", e);
  }

  // Fetch Air Pollution
  let airQuality = null;
  try {
    const airRes = await fetch(`${BASE_URL}/air_pollution?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${API_KEY}`);
    if (airRes.ok) {
      const airData = await airRes.json();
      const components = airData.list[0].components;
      const usAqi = calculateUS_AQI(components.pm2_5);
      airQuality = {
        aqi: usAqi,
        label: getAqiLabel(usAqi),
        components: components
      };
    }
  } catch (e) {
    console.error("Failed to fetch Air Pollution", e);
  }

  // Process Hourly (next 24 hours, usually 8 items from 3-hour forecast)

  // Fetch TRUE hourly data from Open-Meteo
  let trueHourlyList = [];
  try {
    const hourlyRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${currentData.coord.lat}&longitude=${currentData.coord.lon}&hourly=temperature_2m,weathercode,is_day&timeformat=unixtime&timezone=auto&forecast_days=2`);
    if (hourlyRes.ok) {
      const hourlyData = await hourlyRes.json();
      
      // Find the index of the first hour that is >= current time
      // Open-Meteo unixtime is in UTC, just like currentData.dt
      let startIndex = 0;
      for (let i = 0; i < hourlyData.hourly.time.length; i++) {
        if (hourlyData.hourly.time[i] > currentData.dt) { // start from next upcoming hour
          startIndex = i;
          break;
        }
      }
      
      // Map the next 8 hours
      for (let i = startIndex; i < startIndex + 8 && i < hourlyData.hourly.time.length; i++) {
        const isDay = hourlyData.hourly.is_day[i] === 1;
        const code = hourlyData.hourly.weathercode[i];
        
        let icon = isDay ? 'sun' : 'moon';
        if (code >= 71 && code <= 77) icon = 'snowflake';
        else if (code >= 95) icon = 'cloud-lightning';
        else if (code === 45 || code === 48) icon = 'wind';
        else if (code === 1 || code === 2) icon = isDay ? 'cloud-sun' : 'cloud-moon';
        else if (code === 3) icon = isDay ? 'cloud-sun' : 'cloud-moon';
        else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) icon = isDay ? 'cloud-sun-rain' : 'cloud-moon-rain';

        trueHourlyList.push({
          time: formatHour(hourlyData.hourly.time[i], timezone),
          temp: Math.round(hourlyData.hourly.temperature_2m[i]),
          condition: getConditionName(code),
          icon: icon
        });
      }
    }
  } catch (e) {
    console.error("Failed to fetch Open-Meteo hourly data", e);
  }

  // Fallback to OpenWeather 3-hour forecast if Open-Meteo fails
  const hourlyList = trueHourlyList.length > 0 ? trueHourlyList : forecastData.list.slice(0, 8).map(item => ({
    time: formatHour(item.dt, timezone),
    temp: Math.round(item.main.temp),
    condition: item.weather[0].main,
    icon: mapConditionToIcon(item.weather[0].id, item.weather[0].icon)
  }));

  // Insert "Now" at the beginning of hourly
  hourlyList.unshift({
    time: 'Now',
    temp: Math.round(currentData.main.temp),
    condition: currentData.weather[0].main,
    icon: mapConditionToIcon(currentData.weather[0].id, currentData.weather[0].icon)
  });

  // Process Daily (aggregate 3-hour forecasts into daily highs/lows)
  const dailyMap = new Map();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  forecastData.list.forEach(item => {
    // Use local date for grouping
    const date = new Date((item.dt + timezone) * 1000);
    const dayIndex = date.getUTCDay();
    const dayName = dayNames[dayIndex];
    
    if (!dailyMap.has(dayName)) {
      dailyMap.set(dayName, {
        day: dayName,
        high: -Infinity,
        low: Infinity,
        iconId: item.weather[0].id,
        iconCode: item.weather[0].icon,
        pop: item.pop || 0
      });
    }
    
    const dayData = dailyMap.get(dayName);
    dayData.high = Math.max(dayData.high, item.main.temp);
    dayData.low = Math.min(dayData.low, item.main.temp);
    dayData.pop = Math.max(dayData.pop, item.pop || 0);
    
    // Update icon to worst condition of the day ideally, but keeping it simple
    if (item.weather[0].id < dayData.iconId) {
      dayData.iconId = item.weather[0].id;
      dayData.iconCode = item.weather[0].icon;
    }
  });

  const dailyList = Array.from(dailyMap.values()).slice(0, 5).map((d, index) => ({
    day: index === 0 ? 'Today' : d.day,
    high: Math.round(d.high),
    low: Math.round(d.low),
    icon: mapConditionToIcon(d.iconId, d.iconCode.replace('n', 'd')),
    precipitation: d.pop > 0 ? `${Math.round(d.pop * 100)}%` : '0%'
  }));

  // Fetch Open-Meteo 16-day forecast
  let finalDailyList = dailyList; // fallback
  try {
    const omRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${currentData.coord.lat}&longitude=${currentData.coord.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=16`);
    if (omRes.ok) {
      const omData = await omRes.json();
      const today = new Date();
      today.setHours(0,0,0,0);
      
      finalDailyList = omData.daily.time.map((timeStr, idx) => {
        // Open-Meteo returns timeStr like "2023-10-01"
        const [year, month, day] = timeStr.split('-');
        const dateObj = new Date(year, month - 1, day);
        
        const diffTime = dateObj.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        let dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        if (diffDays === 0) dayName = 'Today';
        else if (diffDays === 1) dayName = 'Tomorrow';

        return {
          day: dayName,
          icon: mapOpenMeteoCodeToIcon(omData.daily.weather_code[idx]),
          high: Math.round(omData.daily.temperature_2m_max[idx]),
          low: Math.round(omData.daily.temperature_2m_min[idx]),
          precipitation: omData.daily.precipitation_probability_max[idx] > 0 ? `${omData.daily.precipitation_probability_max[idx]}%` : '0%'
        };
      });
    }
  } catch(e) {
    console.error("Failed to fetch Open-Meteo", e);
  }

  // The current live temperature might exceed the forecast bounds
  const currentTemp = Math.round(currentData.main.temp);
  const forecastHigh = finalDailyList[0] ? finalDailyList[0].high : Math.round(currentData.main.temp_max);
  const forecastLow = finalDailyList[0] ? finalDailyList[0].low : Math.round(currentData.main.temp_min);
  
  const trueHigh = Math.max(currentTemp, forecastHigh);
  const trueLow = Math.min(currentTemp, forecastLow);
  
  // Ensure "Today" reflects the true high/low if it exists
  if (finalDailyList[0] && finalDailyList[0].day === 'Today') {
    finalDailyList[0].high = trueHigh;
    finalDailyList[0].low = trueLow;
  }

    return {
    location: `${currentData.name}, ${currentData.sys.country}`,
    lat: currentData.coord.lat,
    lon: currentData.coord.lon,
    temperature: currentTemp,
    feelsLike: Math.round(currentData.main.feels_like),
    condition: mapConditionToTheme(currentData.weather[0].id, currentData.weather[0].icon),
    high: trueHigh,
    low: trueLow,
    sunrise: formatTime(currentData.sys.sunrise, timezone),
    sunset: formatTime(currentData.sys.sunset, timezone),
    sunriseTime: currentData.sys.sunrise,
    sunsetTime: currentData.sys.sunset,
    currentTime: currentData.dt,
    timezoneOffset: timezone,
    metrics: {
      humidity: `${currentData.main.humidity}%`,
      wind: `${Math.round(currentData.wind.speed * 3.6)} km/h ${getWindDirection(currentData.wind.deg)}`,
      pressure: `${currentData.main.pressure} hPa`,
      visibility: `${(currentData.visibility / 1000).toFixed(1)} km`,
      uvIndex: uviValue
    },
    airQuality: airQuality,
    hourly: hourlyList,
    daily: finalDailyList
  };
};

export const fetchWeatherData = async (city) => {
  if (!API_KEY) throw new Error('API Key is missing.');
  try {
    const currentRes = await fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`);
    const forecastRes = await fetch(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`);
    return await processWeatherData(currentRes, forecastRes);
  } catch (error) {
    console.error('Error fetching weather by city:', error);
    throw error;
  }
};

export const fetchWeatherByCoords = async (lat, lon) => {
  if (!API_KEY) throw new Error('API Key is missing.');
  try {
    const currentRes = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
    const forecastRes = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
    return await processWeatherData(currentRes, forecastRes);
  } catch (error) {
    console.error('Error fetching weather by coords:', error);
    throw error;
  }
};

export const fetchCitySuggestions = async (query) => {
  if (!API_KEY || !query) return [];
  try {
    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
    const data = await res.json();
    return data.map(item => ({
      name: item.name,
      state: item.state,
      country: item.country,
      lat: item.lat,
      lon: item.lon
    }));
  } catch (err) {
    console.error('Error fetching suggestions:', err);
    return [];
  }
};
