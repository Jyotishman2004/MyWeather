const API_KEY = 'f62b08c530023e69afdd3d7ef3577a22';

async function test() {
  try {
    const res1 = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=51.5074&lon=-0.1278&appid=${API_KEY}`);
    console.log("Air Pollution:", await res1.json());
  } catch (e) {
    console.log("Air error", e.message);
  }

  // OpenWeather UVI API is deprecated, but One Call 3.0 has UVI. Let's try One Call 2.5 uvi endpoint.
  try {
    const res2 = await fetch(`http://api.openweathermap.org/data/2.5/uvi?lat=51.5074&lon=-0.1278&appid=${API_KEY}`);
    console.log("UV Index:", await res2.json());
  } catch (e) {
    console.log("UV error", e.message);
  }
}
test();
