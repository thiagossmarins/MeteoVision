import React from "react";
import { GradientScreen } from "../../components/GradientScreen/GradientScreen";
import { Text } from "../../components/Text/Text";
import { Box } from "../../components/Box/Box";
import { useLocation } from "../../hooks/useLocation";
import { useWeather } from "../../hooks/useWeather";
import { useDynamicWeatherTheme } from "../../hooks/useDynamicWeatherTheme";
import { GlassBox } from "../../components/GlassBox/GlassBox";
import { weatherCodeToText } from "../../utils/weatherCodeToText";
import { UVIndexCard } from "../../components/UvIndexCard/UVIdexCard";
import { uvIndexToText } from "../../utils/uvText";
import { SolarDeclination } from "../../components/SolarDeclination/SolarDeclination";
import { ActivityIndicator, ScrollView } from "react-native";

export function WeatherScreen() {
  const { location, city } = useLocation();

  const { weather, dailyForecast, loadingWeather } = useWeather(
    location?.latitude,
    location?.longitude
  );

  const currentTheme = useDynamicWeatherTheme(weather);

  if (loadingWeather){
    return (
      <GradientScreen
        gradient={currentTheme.gradient}
      >
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator color={"#fff"} size={50} />
        </Box>
      </GradientScreen>
    );
  }

  return (
    <GradientScreen
      gradient={currentTheme.gradient}
    >
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Box justifyContent="center" alignItems="center" flex={1} height={450}>
          <Text preset="mediumFontSize" light>{city ?? 'Carregando...'}</Text>
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

        <GlassBox mt="s16">
          {/* Percorre cada dia da previsão (dailyForecast) usando map, e para cada item cria um bloco visual (Box). Retorna essa lista de componentes, mantendo a ordem original.  */}
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
                <Box flexDirection="row">
                  <Text preset="smallFontSize" mr="s4">☔</Text>
                  <Text width={50} preset="smallFontSize">{day.avgRain}{weather?.hourly_units.precipitation_probability}</Text>
                </Box>
                <Text width={65} preset="smallFontSize">↑{day.maxTemp}{weather?.current_units.temperature_2m}</Text>
                <Text width={65} preset="smallFontSize">↓{day.minTemp}{weather?.current_units.temperature_2m}</Text>
              </Box>
            </Box>
          ))}
        </GlassBox>

        <Box mt="s16" flexDirection="row" alignItems="flex-start" justifyContent="space-between" gap="s16">
          <GlassBox flex={1} height={175}>
            <Text preset="titleBoxFontSize" bold>Umidade</Text>
            
            <Box alignItems="center" justifyContent="flex-end" height={"80%"}>
              <Text preset="mediumFontSize" textAlign="center" medium>{weather?.hourly.relative_humidity_2m[0]}{weather?.hourly_units.relative_humidity_2m}</Text>

              <Box width={"100%"} height={16} backgroundColor="humidityBox" overflow="hidden" borderRadius="s8">
                <Box height={"100%"} backgroundColor="humidity" borderRadius={"s8"} style={{ width: `${weather?.hourly.relative_humidity_2m[0] ?? 0}%` }}></Box>
              </Box>
            </Box>
          </GlassBox>

          <GlassBox flex={1} height={175}>
            <Text preset="titleBoxFontSize" bold>Índice UV</Text>
            <Text preset="smallFontSize" light>{weather ? uvIndexToText(Math.max(...weather.daily.uv_index_max)) : "0"}</Text>
            
            <Box alignItems="center" justifyContent="flex-end" height={"68%"}>
              <UVIndexCard uvValue={weather ? Math.max(...weather.daily.uv_index_max) : 0} />
            </Box>
          </GlassBox>
        </Box>

        <Box mt="s16" flexDirection="row" justifyContent="space-between" gap="s16">
          <GlassBox flex={1} height={175}>
            <Text preset="titleBoxFontSize" bold>Vento</Text>
            <Box alignItems="center" justifyContent="center" height={"80%"}>
              <Text preset="mediumFontSize" medium>{weather?.current.wind_speed_10m.toFixed(0)}</Text>
              <Text preset="mediumFontSize" medium>{weather?.current_units.wind_speed_10m}</Text>
            </Box>
          </GlassBox>

          <GlassBox flex={1} height={175}>
            <Text preset="titleBoxFontSize" bold>Pressão</Text>
            <Box alignItems="center" justifyContent="center" height={"80%"}>
              <Text preset="mediumFontSize" medium>{weather?.hourly.pressure_msl ? Math.max(...weather.hourly.pressure_msl).toFixed(0) : '-'}</Text>
              <Text preset="mediumFontSize" medium>{weather?.hourly_units.pressure_msl}</Text>
            </Box>
          </GlassBox>
        </Box>

        <Box mt="s16" flexDirection="row" justifyContent="space-between" gap="s16">
          <GlassBox flex={1} height={175}>
            <Text preset="titleBoxFontSize" bold>Visibilidade</Text>
            <Box alignItems="flex-start" justifyContent="flex-end" height={"80%"}>
              <Text preset="mediumFontSize" medium>{weather?.hourly.visibility ? Math.max(...weather.hourly.visibility).toFixed(0) : '-'}{weather?.hourly_units.visibility}</Text>
            </Box>
          </GlassBox>

          <GlassBox flex={1} height={175}>
            <Text preset="titleBoxFontSize" bold>Ponto de orvalho</Text>
            <Box alignItems="flex-start" justifyContent="flex-end" height={"80%"}>
              <Text preset="mediumFontSize" medium>{weather?.hourly.dew_point_2m ? Math.max(...weather.hourly.dew_point_2m).toFixed(0) : '-'}{weather?.hourly_units.dew_point_2m}</Text>
            </Box>
          </GlassBox>
        </Box>

        <GlassBox justifyContent="center" alignItems="center" flexDirection="column" mt="s16" >
          {weather?.daily.sunrise[0] && weather?.daily.sunset[0] && (
            <SolarDeclination
              sunrise={weather.daily.sunrise[0]}
              sunset={weather.daily.sunset[0]}
              testMode={false}
            />
          )}
          <Box width={"100%"} alignItems="flex-start" flexDirection="row" gap="s32" justifyContent="center">
            <Box alignItems="center" width={"50%"}>
              <Text preset="smallFontSize" bold>Nascer do sol</Text>
              <Text preset="mediumFontSize">{weather?.daily.sunrise[0].substring(11)}</Text>
            </Box>

            <Box alignItems="center" width={"50%"}>
              <Text preset="smallFontSize" bold>Pôr do sol</Text>
              <Text preset="mediumFontSize">{weather?.daily.sunset[0].substring(11)}</Text>
            </Box>
          </Box>
        </GlassBox>

      </ScrollView>

    </GradientScreen>
  )
}