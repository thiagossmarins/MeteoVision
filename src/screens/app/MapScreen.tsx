import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Box } from "../../components/Box/Box";
import { Button } from "../../components/Button/Button";
import { Text } from "../../components/Text/Text";
import { NavitveStackParamList } from "../../routes/Routes";
import { ArrowBack } from "../../assets/icons/ArrowBack";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { useAppSafeArea } from "../../hooks/useAppSafeArea";
import { useState } from "react";

type MapScreenProps = NativeStackScreenProps<NavitveStackParamList, 'MapScreen'>

type SelectedLocation = {
  latitude: number;
  longitude: number;
}

export function MapScreen({ navigation }: MapScreenProps) {
  const { top, bottom } = useAppSafeArea();
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

  function handleMapPress(event: MapPressEvent) {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
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
          backgroundColor="glassBackground"
          padding="s12"
          borderRadius="s16"
        >
          <Text preset="smallFontSize" bold textAlign="center">📍 Localização selecionada</Text>
          <Text preset="smallFontSize" textAlign="center">
            Lat: {selectedLocation.latitude.toFixed(6)}
          </Text>
          <Text preset="smallFontSize" textAlign="center">
            Lon: {selectedLocation.longitude.toFixed(6)}
          </Text>
        </Box>
      )}

      <MapView
        style={{ flex: 1, zIndex: 5 }}
        mapType="hybrid"
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