import { useEffect, useState } from "react";
import { getWeatherByCoords } from "../api/weather/weatherApi";
import { WeatherData } from "../api/weather/WeatherAPIModels";
import { getDailyForecast } from "../utils/getDailyForecast";

export function useWeather(latitude?: number, longitude?: number) {
  const [weather, setWeather] = useState<WeatherData>();
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [dailyForecast, setDailyForecast] = useState<any[]>([]);

  // Em desenvolvimento usa mock, em produção tenta usar localização real
  const lat = __DEV__ ? -22.3886 : latitude;
  const lon = __DEV__ ? -44.9631 : longitude;

  useEffect(() => {
    if (!lat || !lon) {
      setLoadingWeather(false);
      return;
    }

    setLoadingWeather(true);

    async function load() {
      try {
        console.log(`Buscando clima para: lat=${lat}, lon=${lon}`);
        const data = await getWeatherByCoords(lat, lon);
        setWeather(data);
        const forecast = getDailyForecast(data.hourly);
        setDailyForecast(forecast);
        setWeatherError(null);
        console.log("Clima carregado com sucesso");
      } catch (e: any) {
        console.error("Erro ao carregar clima:", e.message);
        setWeatherError(e.message);
      } finally {
        setLoadingWeather(false);
      }
    }

    load();
  }, [lat, lon]);

  return { weather, loadingWeather, weatherError, dailyForecast };
}