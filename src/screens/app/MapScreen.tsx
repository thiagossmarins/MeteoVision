import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Box } from "../../components/Box/Box";
import { Button } from "../../components/Button/Button";
import { Text } from "../../components/Text/Text";
import { NavitveStackParamList } from "../../routes/Routes";
import { ArrowBack } from "../../assets/icons/ArrowBack";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { useAppSafeArea } from "../../hooks/useAppSafeArea";
import { getCityByCoords } from "../../api/location/getCityByCoords";
import { useWeatherStore } from "../../store/useWeatherStore";
import { useState, useRef } from "react";

type MapScreenProps = NativeStackScreenProps<NavitveStackParamList, 'MapScreen'>

type SelectedLocation = {
  latitude: number;
  longitude: number;
}

export function MapScreen({ navigation }: MapScreenProps) {
  const { top, bottom } = useAppSafeArea();
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);

  // Lê a localização já carregada pela store — sem nova request
  const userLocation = useWeatherStore((state) => state.location);

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

    const city = await getCityByCoords(latitude, longitude);
    setCityName(city);

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
          style={{ bottom: bottom + 24, alignSelf: 'center', zIndex: 10 }}
          position="absolute"
          backgroundColor="backgroundBlack"
          padding="s12"
          borderRadius="s16"
        >
          <Text preset="smallFontSize" bold textAlign="center">📍 {cityName ?? 'Buscando cidade...'}  </Text>
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