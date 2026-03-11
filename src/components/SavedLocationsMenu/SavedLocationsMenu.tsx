import { TouchableOpacity, Dimensions } from "react-native";
import Reanimated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Box } from "../Box/Box";
import { Text } from "../Text/Text";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import { SavedLocation } from "../../store/useWeatherStore";
import { weatherCodeToEmoji } from "../../utils/weatherCodeToEmoji";
import { useAppSafeArea } from "../../hooks/useAppSafeArea";

const SCREEN_WIDTH = Dimensions.get("window").width;
const MENU_WIDTH = SCREEN_WIDTH * 0.82;

type SavedLocationsMenuProps = {
  visible: boolean;
  locations: SavedLocation[];
  onClose: () => void;
  onRemove: (id: string) => void;
};

export function SavedLocationsMenu({
  visible,
  locations,
  onClose,
  onRemove,
}: SavedLocationsMenuProps) {
  const { top, bottom } = useAppSafeArea();

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: withTiming(visible ? 1 : 0, { duration: 250 }),
    pointerEvents: visible ? "auto" : "none",
  }));

  const menuStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(visible ? 0 : -MENU_WIDTH, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        }),
      },
    ],
  }));

  return (
    <>
      {/* Backdrop escuro */}
      <Reanimated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 50,
          },
          backdropStyle,
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
      </Reanimated.View>

      {/* Painel deslizante */}
      <Reanimated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: MENU_WIDTH,
            backgroundColor: "#000",
            zIndex: 51,
            paddingTop: top + 16,
            paddingBottom: bottom + 16,
            paddingHorizontal: 24,
          },
          menuStyle,
        ]}
      >
        {/* Cabeçalho */}
        <Box flexDirection="row" justifyContent="space-between" alignItems="center" mb="s24">
          <Text preset="mediumFontSize" bold>Localizações</Text>
          <TouchableOpacity onPress={onClose}>
            <Text preset="smallFontSize" style={{ color: "rgba(255,255,255,0.5)" }}>✕</Text>
          </TouchableOpacity>
        </Box>

        {/* Lista */}
        {locations.length === 0 ? (
          <Text preset="titleBoxFontSize" style={{ color: "rgba(255,255,255,0.4)" }}>
            Nenhuma localização salva ainda.
          </Text>
        ) : (
          locations.map((loc) => (
            <Box
              key={loc.id}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              paddingVertical="s12"
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: "rgba(255,255,255,0.1)",
              }}
            >
              <Box flex={1}>
                <Text preset="smallFontSize" bold>{loc.city}</Text>
                <Text preset="titleBoxFontSize" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {[loc.state, loc.country].filter(Boolean).join(", ")}
                </Text>
                {loc.weather && (
                  <Text preset="titleBoxFontSize" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {weatherCodeToEmoji(loc.weather.current.weather_code)}{" "}
                    {loc.weather.current.temperature_2m.toFixed(0)}
                    {loc.weather.current_units.temperature_2m}
                  </Text>
                )}
              </Box>

              <TouchableOpacity
                onPress={() => onRemove(loc.id)}
                style={{
                  padding: 8,
                  marginLeft: 12,
                }}
              >
                <TrashIcon />
              </TouchableOpacity>
            </Box>
          ))
        )}
      </Reanimated.View>
    </>
  );
}
