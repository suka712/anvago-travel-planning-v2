import type { WeatherResponse } from '@anvago/shared';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// City coordinates
const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  'Danang': { lat: 16.0544, lon: 108.2022 },
  'danang': { lat: 16.0544, lon: 108.2022 },
  'Hoi An': { lat: 15.8801, lon: 108.3380 },
  'Hue': { lat: 16.4637, lon: 107.5909 },
};

export async function getWeather(city: string): Promise<WeatherResponse> {
  const coords = CITY_COORDS[city] || CITY_COORDS['Danang'];

  // Try real API first
  if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'your-openweather-api-key') {
    try {
      const [current, forecast] = await Promise.all([
        fetchCurrentWeather(coords),
        fetchForecast(coords),
      ]);
      
      return {
        location: {
          name: city,
          country: 'Vietnam',
          ...coords,
          latitude: coords.lat,
          longitude: coords.lon,
        },
        current,
        forecast,
      };
    } catch (error) {
      console.error('OpenWeather API error:', error);
    }
  }

  // Return mock data
  return getMockWeather(city);
}

async function fetchCurrentWeather(coords: { lat: number; lon: number }) {
  const response = await fetch(
    `${OPENWEATHER_BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
  );
  
  if (!response.ok) throw new Error('Weather API failed');
  
  const data = await response.json();
  
  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    uvIndex: 7, // UV not in basic API
    visibility: data.visibility / 1000,
    condition: mapCondition(data.weather[0].main),
    icon: mapIcon(data.weather[0].icon),
  };
}

async function fetchForecast(coords: { lat: number; lon: number }) {
  const response = await fetch(
    `${OPENWEATHER_BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
  );
  
  if (!response.ok) throw new Error('Forecast API failed');
  
  const data = await response.json();
  
  // Group by day
  const dailyForecasts = new Map<string, any[]>();
  data.list.forEach((item: any) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyForecasts.has(date)) {
      dailyForecasts.set(date, []);
    }
    dailyForecasts.get(date)!.push(item);
  });

  const forecast = Array.from(dailyForecasts.entries())
    .slice(0, 5)
    .map(([date, items]) => {
      const temps = items.map((i: any) => i.main.temp);
      const conditions = items.map((i: any) => i.weather[0].main);
      const rainChances = items.map((i: any) => (i.pop || 0) * 100);
      
      return {
        date,
        sunrise: '06:00',
        sunset: '18:00',
        temp: {
          min: Math.round(Math.min(...temps)),
          max: Math.round(Math.max(...temps)),
        },
        humidity: Math.round(items.reduce((sum: number, i: any) => sum + i.main.humidity, 0) / items.length),
        rainChance: Math.round(Math.max(...rainChances)),
        condition: mapCondition(getMostCommon(conditions)),
        icon: '☀️',
      };
    });

  return forecast;
}

function mapCondition(condition: string): any {
  const map: Record<string, any> = {
    'Clear': 'clear',
    'Clouds': 'partly_cloudy',
    'Rain': 'rain',
    'Drizzle': 'rain',
    'Thunderstorm': 'thunderstorm',
    'Snow': 'cloudy',
    'Mist': 'fog',
    'Fog': 'fog',
  };
  return map[condition] || 'partly_cloudy';
}

function mapIcon(iconCode: string): string {
  const map: Record<string, string> = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  };
  return map[iconCode] || '☀️';
}

function getMostCommon(arr: string[]): string {
  const counts = new Map<string, number>();
  arr.forEach(item => counts.set(item, (counts.get(item) || 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Clear';
}

function getMockWeather(city: string): WeatherResponse {
  const coords = CITY_COORDS[city] || CITY_COORDS['Danang'];
  const today = new Date();
  
  return {
    location: {
      name: city,
      country: 'Vietnam',
      latitude: coords.lat,
      longitude: coords.lon,
    },
    current: {
      temp: 28,
      feelsLike: 32,
      humidity: 75,
      windSpeed: 3.5,
      uvIndex: 7,
      visibility: 10,
      condition: 'partly_cloudy',
      icon: '⛅',
    },
    forecast: Array.from({ length: 5 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      return {
        date: date.toISOString().split('T')[0],
        sunrise: '05:45',
        sunset: '18:15',
        temp: {
          min: 24 + Math.floor(Math.random() * 3),
          max: 30 + Math.floor(Math.random() * 4),
        },
        humidity: 70 + Math.floor(Math.random() * 15),
        rainChance: i === 2 ? 60 : Math.floor(Math.random() * 30),
        condition: i === 2 ? 'rain' : 'partly_cloudy',
        icon: i === 2 ? '🌧️' : '⛅',
      };
    }),
  };
}

