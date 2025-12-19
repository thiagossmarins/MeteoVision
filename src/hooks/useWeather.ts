import { useEffect, useState } from "react";
import { getWeatherByCoords } from "../api/weather/weatherApi";
import { WeatherData } from "../api/weather/WeatherAPIModels";
import { getDailyForecast } from "../utils/getDailyForecast";

export function useWeather(latitude?: number, longitude?: number) {
  const [weather, setWeather] = useState<WeatherData>();
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [dailyForecast, setDailyForecast] = useState<any[]>([]);

  // tive que fazer um mock porque meu emulador está meio bugado e não está pegando a localização
  const lat = __DEV__ ? -33.889613 : latitude;
  const lon = __DEV__ ? -151.214281 : longitude;

  useEffect(() => {
    if (!lat || !lon) return;

    setLoadingWeather(true);

    async function load() {
      try {
        const data = await getWeatherByCoords(lat, lon);
        setWeather(data);
        const forecast = getDailyForecast(data.hourly);
        setDailyForecast(forecast);
      } catch (e: any) {
        setWeatherError(e.message);
      } finally {
        setLoadingWeather(false);
      }
    }

    load();
  }, [lat, lon]);

  return { weather, loadingWeather, weatherError, dailyForecast };
}