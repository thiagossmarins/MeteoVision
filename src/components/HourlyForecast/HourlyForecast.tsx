import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import { Box } from "../Box/Box";
import { Text } from "../Text/Text";
import { weatherCodeToEmoji } from "../../utils/weatherCodeToEmoji";
import { WeatherData } from "../../api/weather/WeatherAPIModels";

interface HourlyForecastProps {
  weather?: WeatherData;
}

export function HourlyForecast({ weather }: HourlyForecastProps) {
  // Pega apenas as 24 primeiras horas (hoje)
  const hourlyData = useMemo(() => {
    if (!weather?.hourly) return [];

    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push({
        time: weather.hourly.time[i],
        temperature: weather.hourly.temperature_2m[i],
        weatherCode: weather.hourly.weather_code[i],
        humidity: weather.hourly.relative_humidity_2m[i],
        precipitation: weather.hourly.precipitation_probability[i],
      });
    }

    return hours;
  }, [weather?.hourly]);

  if (hourlyData.length === 0) return null;

  const getHourFromTime = (timeStr: string) => {
    const hour = timeStr.split("T")[1]?.substring(0, 2);
    return hour || "00";
  };

  return (
    <Box mt="s16">
      <ScrollView 
        horizontal 
      >
        <Box flexDirection="row" gap="s8">
          {hourlyData.map((hour, index) => (
            <Box
              key={index}
              alignItems="center"
              width={60}
              minHeight={100}
            >
              <Text preset="smallFontSize" bold textAlign="center">
                {getHourFromTime(hour.time)}h
              </Text>

              <Text 
                preset="mediumFontSize"
                marginVertical="s8"
                textAlign="center"
              >
                {weatherCodeToEmoji(hour.weatherCode)}
              </Text>

              <Text preset="smallFontSize" bold textAlign="center">
                {hour.temperature.toFixed(0)}{weather?.current_units.temperature_2m}
              </Text>
            </Box>
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
}
