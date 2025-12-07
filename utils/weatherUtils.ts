export function getWeatherIcon(condition: string): string {
  switch (condition.toLowerCase()) {
    case 'clear': return '☀️';
    case 'clouds': return '☁️';
    case 'rain': return '🌧️';
    case 'drizzle': return '🌦️';
    case 'snow': return '❄️';
    case 'thunderstorm': return '⛈️';
    case 'mist': return '🌫️';
    case 'smoke': return '🌫️';
    case 'haze': return '🌫️';
    case 'dust': return '🌫️';
    case 'fog': return '🌫️';
    case 'sand': return '🌫️';
    case 'ash': return '🌋';
    case 'squall': return '💨';
    case 'tornado': return '🌪️';
    default: return '☀️';
  }
}
