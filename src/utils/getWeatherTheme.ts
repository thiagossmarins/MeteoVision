import { GradientColors } from "../theme/theme";

export interface WeatherTheme {
  gradient: GradientColors;
  name: string;
}

export function getWeatherTheme(weatherCode: number, isDay: number): WeatherTheme {
  if (isDay === 0) {
    return {
      gradient: "night",
      name: "Noite",
    };
  }

  if (weatherCode === 0 || weatherCode === 1 || weatherCode === 2) {
    return {
      gradient: "clear",
      name: "Céu Limpo",
    };
  }

  if (weatherCode === 3) {
    return {
      gradient: "clouds",
      name: "Nublado",
    };
  }

  if (
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 82)
  ) {
    return {
      gradient: "rain",
      name: "Chuvoso",
    };
  }

  if (weatherCode >= 71 && weatherCode <= 77) {
    return {
      gradient: "snow",
      name: "Nevado",
    };
  }

  if (weatherCode >= 95 && weatherCode <= 99) {
    return {
      gradient: "storm",
      name: "Trovoada",
    };
  }

  if (weatherCode === 45 || weatherCode === 48) {
    return {
      gradient: "clouds",
      name: "Névoa",
    };
  }

  return {
    gradient: "clear",
    name: "Céu Limpo",
  };
}
