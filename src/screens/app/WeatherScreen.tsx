import React from "react";
import { GradientScreen } from "../../components/GradientScreen/GradientScreen";
import { Text } from "../../components/Text/Text";
import { Box } from "../../components/Box/Box";
import { useLocation } from "../../hooks/useLocation";
import { useWeather } from "../../hooks/useWeather";
import { GlassBox } from "../../components/GlassBox/GlassBox";
import { weatherCodeToText } from "../../utils/weatherCodeToText";
import { UVIndexCard } from "../../components/UvIndexCard/UVIdexCard";
import { uvIndexToText } from "../../utils/uvText";

export function WeatherScreen() {
  const { location } = useLocation();

  const { weather } = useWeather(
    location?.latitude,
    location?.longitude
  );

  return (
    <GradientScreen
      gradient="rain"
    >
      <Box justifyContent="center" alignItems="center" flex={1}>
        <Text preset="mediumFontSize" light>Minha cidade</Text>
        <Box alignItems="flex-start" justifyContent="center" flexDirection="row">
          <Text preset="bigFontSize" light>{weather?.current.temperature_2m.toFixed(0)}</Text>
          <Text preset="mediumFontSize">{weather?.current_units.temperature_2m}</Text>
        </Box>
        <Text preset="smallFontSize">
          ↑{weather?.daily.temperature_2m_max[0].toFixed(0)}{weather?.current_units.temperature_2m} /
          ↓{weather?.daily.temperature_2m_min[0].toFixed(0)}{weather?.current_units.temperature_2m}
        </Text>
        <Text preset="smallFontSize">
          {weather ? weatherCodeToText(weather.current.weather_code) : ""}
        </Text>
      </Box>

      <Box mt="s16">
        <Text preset="smallFontSize">
          Hoje faz máximas de {weather?.daily.temperature_2m_max[0].toFixed(0)}{weather?.current_units.temperature_2m} e 
          mínimas de {weather?.daily.temperature_2m_min[0].toFixed(0)}{weather?.current_units.temperature_2m}.
          Sensação térmica de {weather?.current.apparent_temperature.toFixed(0)}{weather?.current_units.temperature_2m}
        </Text>
      </Box>

      <Box mt="s16" flexDirection="row" alignItems="flex-start" justifyContent="space-between" gap="s16">
        <GlassBox flex={1}>
          <Text preset="smallFontSize" bold>Umidade</Text>
          <Text preset="mediumFontSize" textAlign="center">{weather?.hourly.relative_humidity_2m[0]}{weather?.hourly_units.relative_humidity_2m}</Text>

          <Box width={"100%"} height={16} backgroundColor="humidityBox" overflow="hidden" borderRadius="s8">
            <Box height={"100%"} backgroundColor="humidity" borderRadius={"s8"} style={{ width: `${weather?.hourly.relative_humidity_2m[0] ?? 0}%` }}></Box>
          </Box>
        </GlassBox>

        <GlassBox flex={1}>
          <Text preset="smallFontSize" bold>UV</Text>
          <Text preset="mediumFontSize">{weather ? uvIndexToText(weather?.daily.uv_index_max[0]) : "0"}</Text>
          <UVIndexCard uvValue={weather?.daily.uv_index_max[0] ?? 0} />
        </GlassBox>
      </Box>

      <Box mt="s16" flexDirection="row" justifyContent="space-between" gap="s16">
        <GlassBox flex={1}>
          <Text preset="smallFontSize" bold>Vento</Text>
          <Box alignItems="center">
            <Text preset="mediumFontSize">{weather?.current.wind_speed_10m.toFixed(0)}</Text>
            <Text preset="mediumFontSize">{weather?.current_units.wind_speed_10m}</Text>
          </Box>
        </GlassBox>

        <GlassBox flex={1}>
          <Text preset="smallFontSize" bold>Pressão</Text>
          <Box alignItems="center">

          </Box>
        </GlassBox>
      </Box>

      <GlassBox flexDirection="row" alignItems="center" justifyContent="space-between" mt="s16">
        <Box>
          <Text preset="smallFontSize" bold>Nascer do sol</Text>
          <Text preset="mediumFontSize">{weather?.daily.sunrise[0].substring(11)}</Text>
        </Box>

        <Box>
          <Text preset="smallFontSize" bold>Pôr-do-sol</Text>
          <Text preset="mediumFontSize">{weather?.daily.sunset[0].substring(11)}</Text>
        </Box>
      </GlassBox>
    </GradientScreen>
  )
}