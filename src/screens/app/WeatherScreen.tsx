import React from "react";
import { GradientScreen } from "../../components/GradientScreen/GradientScreen";
import { Text } from "../../components/Text/Text";
import { Box } from "../../components/Box/Box";
import { useLocation } from "../../hooks/useLocation";
import { useWeather } from "../../hooks/useWeather";

export function WeatherScreen() {
  const { location } = useLocation();

  const { weather } = useWeather(
    location?.latitude,
    location?.longitude
  );

  return (
    <GradientScreen
      gradient="clear"
    >
      <Box justifyContent="center" alignItems="center" flex={1}>
        <Text preset="mediumFontSize" bold italic>Está com {weather?.current.temperature_2m}</Text>
      </Box>
    </GradientScreen>
  )
}