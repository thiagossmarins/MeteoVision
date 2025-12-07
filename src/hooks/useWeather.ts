import { useEffect, useState } from "react";
import { getWeatherByCoords } from "../api/weather/weatherApi";
import { WeatherData } from "../api/weather/WeatherAPIModels";

export function useWeather(latitude?: number, longitude?: number) {
  const [weather, setWeather] = useState<WeatherData>();
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);


  // tive que fazer um mock porque meu emulador está meio bugado e não está pegando a localização
  const lat = __DEV__ ? -23.55052 : latitude;
  const lon = __DEV__ ? -46.633308 : longitude;

  useEffect(() => {
    if (!lat || !lon) return;

    setLoadingWeather(true);

    async function load() {
      try {
        const data = await getWeatherByCoords(lat, lon);
        setWeather(data);
      } catch (e: any) {
        setWeatherError(e.message);
      } finally {
        setLoadingWeather(false);
      }
    }

    load();
  }, [lat, lon]);

  return { weather, loadingWeather, weatherError };
}