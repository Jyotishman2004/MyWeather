export const weatherStates = ['Clear Day', 'Clear Night', 'Rain', 'Thunderstorm', 'Snow', 'Fog'];

export const mockWeatherData = {
  location: "San Francisco, CA",
  temperature: 20,
  condition: "Clear Day",
  date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
  high: 22,
  low: 12,
  sunrise: "6:15 AM",
  sunset: "7:45 PM",
  metrics: {
    humidity: "45%",
    wind: "19 km/h NW",
    pressure: "1012 hPa",
    visibility: "16 km",
    uvIndex: "6 High",
    aqi: "42 Good"
  },
  hourly: [
    { time: 'Now', temp: 20, condition: 'Sun', icon: 'sun' },
    { time: '1 PM', temp: 21, condition: 'Sun', icon: 'sun' },
    { time: '2 PM', temp: 22, condition: 'Sun', icon: 'sun' },
    { time: '3 PM', temp: 22, condition: 'Cloudy', icon: 'cloud-sun' },
    { time: '4 PM', temp: 21, condition: 'Cloud', icon: 'cloud' },
    { time: '5 PM', temp: 18, condition: 'Cloud', icon: 'cloud' },
    { time: '6 PM', temp: 16, condition: 'Moon', icon: 'moon' },
    { time: '7 PM', temp: 15, condition: 'Moon', icon: 'moon' },
    { time: '8 PM', temp: 14, condition: 'Cloud', icon: 'cloud' },
    { time: '9 PM', temp: 13, condition: 'Rain', icon: 'cloud-rain' },
    { time: '10 PM', temp: 13, condition: 'Rain', icon: 'cloud-rain' },
    { time: '11 PM', temp: 12, condition: 'Cloud', icon: 'cloud' },
    { time: '12 AM', temp: 11, condition: 'Cloud', icon: 'cloud' },
    { time: '1 AM', temp: 10, condition: 'Moon', icon: 'moon' },
    { time: '2 AM', temp: 10, condition: 'Moon', icon: 'moon' },
    { time: '3 AM', temp: 9, condition: 'Rain', icon: 'cloud-rain' },
    { time: '4 AM', temp: 9, condition: 'Rain', icon: 'cloud-rain' },
    { time: '5 AM', temp: 8, condition: 'Cloud', icon: 'cloud' },
    { time: '6 AM', temp: 9, condition: 'Sun', icon: 'sun' },
    { time: '7 AM', temp: 11, condition: 'Sun', icon: 'sun' },
    { time: '8 AM', temp: 14, condition: 'Sun', icon: 'sun' },
    { time: '9 AM', temp: 16, condition: 'Cloudy', icon: 'cloud-sun' },
    { time: '10 AM', temp: 18, condition: 'Cloud', icon: 'cloud' }
  ],
  daily: [
    { day: "Today", high: 22, low: 12, icon: "sun", precipitation: "0%" },
    { day: "Mon", high: 20, low: 11, icon: "cloud-rain", precipitation: "40%" },
    { day: "Tue", high: 18, low: 10, icon: "cloud-rain", precipitation: "60%" },
    { day: "Wed", high: 21, low: 12, icon: "cloud-sun", precipitation: "10%" },
    { day: "Thu", high: 24, low: 13, icon: "sun", precipitation: "0%" },
    { day: "Fri", high: 25, low: 14, icon: "sun", precipitation: "0%" },
    { day: "Sat", high: 23, low: 13, icon: "cloud", precipitation: "0%" },
  ]
};
