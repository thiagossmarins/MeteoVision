import React from "react";
import { Box } from "../Box/Box";
import { Text } from "../Text/Text";
import { weatherCodeToEmoji } from "../../utils/weatherCodeToEmoji";
import { WeatherData } from "../../api/weather/WeatherAPIModels";

interface DailyForecastProps {
  dailyForecast: any[];
  weather?: WeatherData;
}

export function DailyForecast({ dailyForecast, weather }: DailyForecastProps) {
  return (
    <>
      {dailyForecast.map((day, index) => (
        <Box
          key={index}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginVertical="s8"
        >
          <Text preset="smallFontSize">{day.weekday}</Text>
          <Box flexDirection="row" gap="s24" alignItems="center">
            <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap="s4">
              <Text preset="smallFontSize" mr="s4">
                {weatherCodeToEmoji(weather?.daily.weather_code[index] ?? 0)}
              </Text>
              <Text width={50} preset="smallFontSize" textAlign="center">{day.avgRain}{weather?.hourly_units.precipitation_probability}</Text>
            </Box>
            <Text width={65} preset="smallFontSize">↑{day.maxTemp}{weather?.current_units.temperature_2m}</Text>
            <Text width={65} preset="smallFontSize">↓{day.minTemp}{weather?.current_units.temperature_2m}</Text>
          </Box>
        </Box>
      ))}
    </>
  );
}
