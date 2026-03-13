import { TouchableOpacity } from "react-native";
import { Box } from "../Box/Box";
import { Text } from "../Text/Text";
import { WeatherData } from "../../api/weather/WeatherAPIModels";
import { weatherCodeToEmoji } from "../../utils/weatherCodeToEmoji";

type MapLocationCardProps = {
  cityName: string | null;
  stateName: string | null;
  countryName: string | null;
  weather: WeatherData | null;
  saved: boolean;
  onSave: () => void;
};

export function MapLocationCard({
  cityName,
  stateName,
  countryName,
  weather,
  saved,
  onSave,
}: MapLocationCardProps) {
  return (
    <Box
      backgroundColor="backgroundBlack"
      padding="s16"
      borderRadius="s16"
    >
      <Box flexDirection="row" justifyContent="space-between" gap="s48">
        <Box maxWidth={180}>
          <Text preset="smallFontSize" bold>
            {cityName ?? 'Buscando...'}
          </Text>
          <Text preset="titleBoxFontSize" bold>
            {[stateName, countryName].filter(Boolean).join(', ')}
          </Text>
        </Box>

        {weather && (
          <Box>
            <Text preset="smallFontSize" bold mb="s4">
              {weatherCodeToEmoji(weather.current.weather_code)}{' '}
              {weather.current.temperature_2m.toFixed(0)}{weather.current_units.temperature_2m}
            </Text>
            <Text preset="titleBoxFontSize" bold>
              ↑{weather.daily.temperature_2m_max[0].toFixed(0)} /
              ↓{weather.daily.temperature_2m_min[0].toFixed(0)}
            </Text>
          </Box>
        )}
      </Box>

      {cityName && weather && (
        <Box mt="s12" alignItems="center">
          <TouchableOpacity testID="btn-salvar-localizacao" onPress={onSave} disabled={saved}>
            <Text preset="smallFontSize" bold mt="s32" style={{ opacity: saved ? 0.6 : 1 }}>
              {saved ? 'Localização salva ✓' : 'Salvar localização'}
            </Text>
          </TouchableOpacity>
        </Box>
      )}
    </Box>
  );
}
