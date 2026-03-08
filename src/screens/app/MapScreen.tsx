import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Box } from "../../components/Box/Box";
import { Button } from "../../components/Button/Button";
import { Text } from "../../components/Text/Text";
import { NavitveStackParamList } from "../../routes/Routes";
import { ArrowBack } from "../../assets/icons/ArrowBack";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { useAppSafeArea } from "../../hooks/useAppSafeArea";
import { getCityByCoords } from "../../api/location/getCityByCoords";
import { getWeatherByCoords } from "../../api/weather/weatherApi";
import { WeatherData } from "../../api/weather/WeatherAPIModels";
import { useWeatherStore } from "../../store/useWeatherStore";
import { weatherCodeToEmoji } from "../../utils/weatherCodeToEmoji";
import { useState, useRef } from "react";
import { TouchableOpacity } from "react-native";

type MapScreenProps = NativeStackScreenProps<NavitveStackParamList, 'MapScreen'>

type SelectedLocation = {
  latitude: number;
  longitude: number;
}

export function MapScreen({ navigation }: MapScreenProps) {
  const { top, bottom } = useAppSafeArea();
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [stateName, setStateName] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [pinWeather, setPinWeather] = useState<WeatherData | null>(null);

  // Lê a localização já carregada pela store — sem nova request
  const userLocation = useWeatherStore((state) => state.location);
  const saveLocation = useWeatherStore((state) => state.saveLocation);

  // Controla o feedback visual do botão Salvar ("Salvo ✓" por 2s)
  const [saved, setSaved] = useState(false);

  const initialRegion = userLocation ? {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  } : undefined;

  // useRef cria uma referência direta ao componente nativo MapView
  // isso nos permite chamar métodos imperativos nele, como animateToRegion,
  // sem precisar de estado ou re-renderização
  const mapRef = useRef<MapView>(null);

  async function handleMapPress(event: MapPressEvent) {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    setCityName(null);
    setStateName(null);
    setCountryName(null);
    setPinWeather(null);
    setSaved(false);

    // Busca cidade e clima do ponto clicado em paralelo
    const [city, weatherData] = await Promise.all([
      getCityByCoords(latitude, longitude),
      getWeatherByCoords(latitude, longitude),
    ]);
    setCityName(city.city);
    setStateName(city.state);
    setCountryName(city.country);
    setPinWeather(weatherData);

    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1500
    );
  }

  function handleSave() {
    if (!selectedLocation || !cityName || !pinWeather) return;
    saveLocation({
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      city: cityName,
      state: stateName ?? '',
      country: countryName ?? '',
      weather: pinWeather,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Box flex={1}>

      <Button
        style={{ top: top, left: 24, zIndex: 10 }}
        onPress={() => navigation.goBack()}
      >
        <ArrowBack />
      </Button>

      {selectedLocation && (
        <Box
          style={{
            bottom: bottom + 24,
            alignSelf: 'center',
            zIndex: 10,
            width: "80%",
            maxWidth: "80%",
          }}
          position="absolute"
          backgroundColor="backgroundBlack"
          padding="s16"
          borderRadius="s16"
        >
          <Box
            flexDirection="row"
            justifyContent="space-between"
            gap="s48"
          >
            <Box
              maxWidth={165}
            >
              <Text preset="smallFontSize" bold>
                {cityName ?? 'Buscando...'}
              </Text>
              <Text preset="titleBoxFontSize" bold>
                {stateName ?? ''}, {countryName ?? ''}
              </Text>
            </Box>
            {pinWeather && (
              <Box>
                <Text preset="smallFontSize" bold mb="s4">
                  {weatherCodeToEmoji(pinWeather.current.weather_code)} {pinWeather.current.temperature_2m.toFixed(0)}{pinWeather.current_units.temperature_2m}
                </Text>
                <Text preset="titleBoxFontSize" bold>
                  ↑{pinWeather.daily.temperature_2m_max[0].toFixed(0)} /
                  ↓{pinWeather.daily.temperature_2m_min[0].toFixed(0)}
                </Text>
              </Box>
            )}
          </Box>

          {/* Botão Salvar — só aparece quando os dados já carregaram */}
          {cityName && pinWeather && (
            <Box mt="s12" alignItems="center">
              <TouchableOpacity onPress={handleSave} disabled={saved}>
                <Text preset="smallFontSize" bold style={{ opacity: saved ? 0.6 : 1 }}>
                  {saved ? 'Salvo ✓' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </Box>
          )}
        </Box>
      )}

      <MapView
        ref={mapRef}
        style={{ flex: 1, zIndex: 5 }}
        mapType="hybrid"
        initialRegion={initialRegion}
        zoomEnabled
        zoomTapEnabled
        scrollEnabled
        rotateEnabled
        pitchEnabled
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} />
        )}
      </MapView>

    </Box>
  )
}