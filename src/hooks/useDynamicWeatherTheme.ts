import { useMemo } from "react";
import { getWeatherTheme } from "../utils/getWeatherTheme";
import { WeatherData } from "../api/weather/WeatherAPIModels";

export function useDynamicWeatherTheme(weather: WeatherData | null | undefined) {
  const theme = useMemo(() => {
    if (!weather) {
      return {
        gradient: "clear" as const,
        name: "Carregando...",
      };
    }

    return getWeatherTheme(weather.current.weather_code, weather.current.is_day);
  }, [weather]);

  return theme;
}
