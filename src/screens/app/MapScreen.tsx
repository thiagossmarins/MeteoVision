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
import { TouchableOpacity, TextInput, ScrollView, Keyboard } from "react-native";
import Reanimated, { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import { searchCityByName } from "../../api/location/searchCityByName";
import { CitySearchResult } from "../../api/location/CityAPIModels";

type MapScreenProps = NativeStackScreenProps<NavitveStackParamList, 'MapScreen'>

type SelectedLocation = {
  latitude: number;
  longitude: number;
}

export function MapScreen({ navigation }: MapScreenProps) {
  const { bottom } = useAppSafeArea();
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

  // Busca por nome de cidade
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Rastreia a região atual do mapa para calcular o ponto de saída da animação
  const currentRegionRef = useRef<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  function handleSearchChange(text: string) {
    setSearchQuery(text);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (text.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchCityByName(text);
      setSearchResults(results);
      setShowResults(true);
    }, 500);
  }

  async function handleSelectCity(result: CitySearchResult) {
    Keyboard.dismiss();
    setShowResults(false);
    setSearchQuery('');
    setSelectedLocation({ latitude: result.latitude, longitude: result.longitude });
    setCityName(null);
    setStateName(null);
    setCountryName(null);
    setPinWeather(null);
    setSaved(false);

    // Inicia o fetch do clima em paralelo com a animação
    const weatherPromise = getWeatherByCoords(result.latitude, result.longitude);

    // Animação em 3 passos: zoom out na origem → pan para destino → zoom in no destino
    const origin = currentRegionRef.current ?? (userLocation
      ? { latitude: userLocation.latitude, longitude: userLocation.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }
      : null);

    if (origin) {
      // Calcula o zoom out necessário para cobrir a distância entre os dois pontos
      const latSpan = Math.abs(origin.latitude - result.latitude);
      const lngSpan = Math.abs(origin.longitude - result.longitude);
      const zoomOutLat = Math.min(Math.max(latSpan * 3, 10), 170);
      const zoomOutLng = Math.min(Math.max(lngSpan * 3, 10), 340);

      // Passo 1: zoom out mantendo câmera na origem
      mapRef.current?.animateToRegion(
        {
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: zoomOutLat,
          longitudeDelta: zoomOutLng,
        },
        800
      );

      // Passo 2: pan para o destino (ainda com zoom aberto)
      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude: result.latitude,
            longitude: result.longitude,
            latitudeDelta: zoomOutLat,
            longitudeDelta: zoomOutLng,
          },
          1000
        );
      }, 900);

      // Passo 3: zoom in no destino
      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude: result.latitude,
            longitude: result.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          1200
        );
      }, 2000);
    } else {
      // Sem posição de origem conhecida, vai direto
      mapRef.current?.animateToRegion(
        {
          latitude: result.latitude,
          longitude: result.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1500
      );
    }

    const weatherData = await weatherPromise;
    setCityName(result.city);
    setStateName(result.state);
    setCountryName(result.country);
    setPinWeather(weatherData);
  }

  // useRef cria uma referência direta ao componente nativo MapView
  // isso nos permite chamar métodos imperativos nele, como animateToRegion,
  // sem precisar de estado ou re-renderização
  const mapRef = useRef<MapView>(null);

  // Sobe o bottom bar quando o teclado abre
  const keyboard = useAnimatedKeyboard();
  const bottomBarAnimatedStyle = useAnimatedStyle(() => ({
    bottom: keyboard.height.value - bottom,
  }));

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


      <Reanimated.View
        style={[{
          position: 'absolute',
          width: '100%',
          zIndex: 15,
        }, bottomBarAnimatedStyle]}
      >
        <Box
          style={{
            paddingBottom: bottom + 32,
          }}
          width="100%"
          backgroundColor="backgroundBlack"
          padding="s20"
          gap="s8"
          borderTopLeftRadius="s48"
          borderTopRightRadius="s48"
        >
          {/* Linha: botão de voltar + input */}
          <Box flexDirection="row-reverse" alignItems="center" gap="s20">
            <Button
              style={{ position: "relative", zIndex: 10 }}
              onPress={() => navigation.goBack()}
            >
              <ArrowBack />
            </Button>

            <Box
              flex={1}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              borderRadius="s100"
              paddingHorizontal="s16"
              paddingVertical="s16"
              flexDirection="row"
              alignItems="center"
            >
              <TextInput
                value={searchQuery}
                onChangeText={handleSearchChange}
                placeholder="Buscar cidade..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                returnKeyType="search"
                style={{
                  flex: 1,
                  color: '#fff',
                  fontFamily: 'Inter_Regular',
                  fontSize: 16,
                  paddingVertical: 0,
                }}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => { setSearchQuery(''); setShowResults(false); }}>
                  <Text preset="titleBoxFontSize" style={{ color: 'rgba(255,255,255,0.5)', paddingLeft: 8 }}>✕</Text>
                </TouchableOpacity>
              )}
            </Box>
          </Box>

          {/* Dropdown ocupa toda a largura do container */}
          {showResults && searchResults.length > 0 && (
            <Box
              backgroundColor="backgroundBlack"
              borderRadius="s16"
              style={{ maxHeight: 220, overflow: 'hidden' }}
            >
              <ScrollView keyboardShouldPersistTaps="handled">
                {searchResults.map((result, index) => (
                  <TouchableOpacity key={index} onPress={() => handleSelectCity(result)}>
                    <Box
                      paddingHorizontal="s16"
                      paddingVertical="s12"
                      style={{
                        borderBottomWidth: index < searchResults.length - 1 ? 0.5 : 0,
                        borderBottomColor: 'rgba(255,255,255,0.1)',
                      }}
                    >
                      <Text preset="smallFontSize" bold>{result.city}</Text>
                      <Text preset="titleBoxFontSize">
                        {[result.state, result.country].filter(Boolean).join(', ')}
                      </Text>
                    </Box>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Box>
          )}
        </Box>
      </Reanimated.View>

      {selectedLocation && (
        <Box
          style={{
            bottom: bottom + 100,
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
              maxWidth={180}
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
                <Text preset="smallFontSize" bold mt="s32" style={{ opacity: saved ? 0.6 : 1 }}>
                  {saved ? 'Localização salva ✓' : 'Salvar localização'}
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
        onRegionChangeComplete={(region) => { currentRegionRef.current = region; }}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} />
        )}
      </MapView>

    </Box>
  )
}