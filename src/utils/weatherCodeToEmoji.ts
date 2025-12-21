export function weatherCodeToEmoji(code: number): string {
  // WMO Weather interpretation codes
  if (code === 0) return "☀️"; // Clear sky
  if (code === 1 || code === 2) return "🌤️"; // Mainly clear, partly cloudy
  if (code === 3) return "☁️"; // Overcast
  if (code === 45 || code === 48) return "☁️"; // Foggy, Depositing rime fog
  if (code === 51 || code === 53 || code === 55) return "🌧️"; // Drizzle
  if (code === 61 || code === 63 || code === 65) return "🌧️"; // Rain
  if (code === 71 || code === 73 || code === 75) return "❄️"; // Snow
  if (code === 77) return "❄️"; // Snow grains
  if (code === 80 || code === 81 || code === 82) return "⛈️"; // Rain showers
  if (code === 85 || code === 86) return "🌨️"; // Snow showers
  if (code === 95 || code === 96 || code === 99) return "⛈️"; // Thunderstorm
  
  return "🌡️"; // Default
}
