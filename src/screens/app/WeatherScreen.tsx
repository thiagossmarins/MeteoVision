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
import { HourlyForecast } from "../../components/HourlyForecast/HourlyForecast";
import { DailyForecast } from "../../components/DailyForecast/DailyForecast";
import { ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { HumidityIcon } from "../../assets/icons/HumidityIcon";
import { SunnyIcon } from "../../assets/icons/SunnyIcon";
import { humidityToText } from "../../utils/humidityText";
import { useNavigation } from "@react-navigation/native";
import { SearchIcon } from "../../assets/icons/SearchIcon";

export function WeatherScreen() {
  const { location, city } = useLocation();
  const navigation = useNavigation<any>();

  const { weather, dailyForecast, loadingWeather } = useWeather(
    location?.latitude,
    location?.longitude
  );

  const currentTheme = useDynamicWeatherTheme(weather);

  if (loadingWeather) {
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

        <Text preset="mediumFontSize" medium textAlign="center" mt="s20">{city ?? 'Carregando...'}</Text>
        <Box justifyContent="center" alignItems="center" flex={1} height={450}>
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

        <GlassBox mt="s16">
          <Text preset="smallFontSize">
            Hoje faz máximas de {weather?.daily.temperature_2m_max[0].toFixed(0)}{weather?.current_units.temperature_2m} e
            mínimas de {weather?.daily.temperature_2m_min[0].toFixed(0)}{weather?.current_units.temperature_2m}.
            Sensação térmica de {weather?.current.apparent_temperature.toFixed(0)}{weather?.current_units.temperature_2m}
          </Text>

          <HourlyForecast weather={weather} />
        </GlassBox>

        <GlassBox mt="s16">
          <DailyForecast dailyForecast={dailyForecast} weather={weather} />
        </GlassBox>

        <Box mt="s16" flexDirection="row" alignItems="flex-start" justifyContent="space-between" gap="s16">
          <GlassBox flex={1} height={175}>
            <Box flexDirection="row" alignItems="center" gap="s4" mb="s8">
              <HumidityIcon />
              <Text preset="titleBoxFontSize" bold>Umidade</Text>
            </Box>
            <Text preset="smallFontSize" light>
              {humidityToText(weather?.hourly.relative_humidity_2m ? Math.max(...weather.hourly.relative_humidity_2m) : 0)}
            </Text>

            <Box alignItems="center" justifyContent="flex-end" height={"66%"}>
              <Text preset="mediumFontSize" textAlign="center" medium>{weather?.hourly.relative_humidity_2m ? Math.max(...weather.hourly.relative_humidity_2m) : '-'}{weather?.hourly_units.relative_humidity_2m}</Text>

              <Box width={"100%"} height={16} backgroundColor="humidityBox" overflow="hidden" borderRadius="s8">
                <Box height={"100%"} backgroundColor="humidity" borderRadius={"s8"} style={{ width: `${weather?.hourly.relative_humidity_2m ? Math.max(...weather.hourly.relative_humidity_2m) : 0}%` }} />
              </Box>
            </Box>
          </GlassBox>

          <GlassBox flex={1} height={175}>
            <Box flexDirection="row" alignItems="center" gap="s4" mb="s8">
              <SunnyIcon />
              <Text preset="titleBoxFontSize" bold>Índice UV</Text>
            </Box>
            <Text preset="smallFontSize" light>{weather ? uvIndexToText(Math.max(...weather.daily.uv_index_max)) : "0"}</Text>

            <Box alignItems="center" justifyContent="flex-end" height={"68%"}>
              <UVIndexCard uvValue={weather ? Math.max(...weather.daily.uv_index_max) : 0} />
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

      <Box width={"100%"} height={45} paddingVertical="s12" alignItems="flex-end">
        <TouchableOpacity onPress={() => { navigation.navigate('Map') }} style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 25, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
          <SearchIcon />
        </TouchableOpacity>
      </Box>

    </GradientScreen>
  )
}