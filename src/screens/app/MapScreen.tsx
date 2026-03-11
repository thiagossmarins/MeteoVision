import { useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MapView, { Marker } from "react-native-maps";
import Reanimated, { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import { useNetInfo } from "@react-native-community/netinfo";

import { Box } from "../../components/Box/Box";
import { Button } from "../../components/Button/Button";
import { Text } from "../../components/Text/Text";
import { MapSearchBar } from "../../components/MapSearchBar/MapSearchBar";
import { MapLocationCard } from "../../components/MapLocationCard/MapLocationCard";
import { ArrowBack } from "../../assets/icons/ArrowBack";
import { NoWifiIcon } from "../../assets/icons/NoWifiIcon";
import { NavitveStackParamList } from "../../routes/Routes";
import { useAppSafeArea } from "../../hooks/useAppSafeArea";
import { useMapSearch } from "../../hooks/useMapSearch";
import { useMapPin } from "../../hooks/useMapPin";
import { useWeatherStore } from "../../store/useWeatherStore";

type MapScreenProps = NativeStackScreenProps<NavitveStackParamList, 'MapScreen'>

export function MapScreen({ navigation }: MapScreenProps) {
  const { top, bottom } = useAppSafeArea();
  const mapRef = useRef<MapView>(null);
  const currentRegionRef = useRef<{ latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null>(null);

  const userLocation = useWeatherStore((state) => state.location);
  const { isConnected } = useNetInfo();
  const isOffline = isConnected === false;

  const initialRegion = userLocation ? {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  } : undefined;

  const {
    searchQuery,
    searchResults,
    showResults,
    selectedLocation,
    saved: searchSaved,
    handleSearchChange,
    handleSelectCity,
    handleSave: handleSearchSave,
    clearSearch,
  } = useMapSearch({ mapRef, currentRegionRef, userLocation });

  const {
    pinnedLocation,
    saved: pinSaved,
    handleMapPress,
    handleSave: handlePinSave,
  } = useMapPin({ mapRef });

  // Sobe o bottom bar quando o teclado abre
  const keyboard = useAnimatedKeyboard();
  const bottomBarStyle = useAnimatedStyle(() => ({
    bottom: keyboard.height.value - bottom,
  }));

  // Mostra o card da busca por nome, senão o card do pin no mapa
  const activeLocation = selectedLocation ?? (pinnedLocation ? {
    ...pinnedLocation,
    city: pinnedLocation.city,
    state: pinnedLocation.state,
    country: pinnedLocation.country,
    weather: pinnedLocation.weather,
  } : null);

  const markerCoord = selectedLocation
    ? { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }
    : pinnedLocation
      ? { latitude: pinnedLocation.latitude, longitude: pinnedLocation.longitude }
      : null;

  return (
    <Box flex={1}>

      {/* Banner de modo offline */}
      {isOffline && (
        <Box
          position="absolute"
          style={{ top: 0, alignSelf: 'center', zIndex: 30 }}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="s8"
          backgroundColor="backgroundBlack"
          paddingHorizontal="s16"
          paddingVertical="s8"
          borderRadius="s16"
          flex={1}
          width="100%"
          height="100%"
        >
          <NoWifiIcon size={100} color="white" />
          <Text mt="s20" preset="smallFontSize">Sem conexão com internet</Text>
          <Button
            style={{ position: 'absolute', top: top, left: 32, zIndex: 10 }}
            onPress={() => navigation.goBack()}
          >
            <ArrowBack />
          </Button>
        </Box>
      )}

      {/* Card de localização selecionada */}
      {activeLocation && (
        <Box
          position="absolute"
          style={{ bottom: bottom + 100, alignSelf: 'center', zIndex: 10, width: '80%', maxWidth: '80%' }}
        >
          <MapLocationCard
            cityName={activeLocation.city}
            stateName={activeLocation.state}
            countryName={activeLocation.country}
            weather={activeLocation.weather}
            saved={selectedLocation ? searchSaved : pinSaved}
            onSave={selectedLocation ? handleSearchSave : handlePinSave}
          />
        </Box>
      )}

      {/* Bottom bar: busca + botão voltar */}
      <Reanimated.View style={[{ position: 'absolute', width: '100%', zIndex: 15 }, bottomBarStyle]}>
        <Box
          style={{ paddingBottom: bottom + 32 }}
          width="100%"
          backgroundColor="backgroundBlack"
          padding="s20"
          gap="s8"
          borderTopLeftRadius="s48"
          borderTopRightRadius="s48"
        >
          <Box flexDirection="row-reverse" alignItems="center" gap="s20">
            <Button
              style={{ position: 'relative', zIndex: 10 }}
              onPress={() => navigation.goBack()}
            >
              <ArrowBack />
            </Button>

            <MapSearchBar
              query={searchQuery}
              results={searchResults}
              showResults={showResults}
              onChangeText={handleSearchChange}
              onSelectCity={handleSelectCity}
              onClear={clearSearch}
            />
          </Box>
        </Box>
      </Reanimated.View>

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
        {markerCoord && <Marker coordinate={markerCoord} />}
      </MapView>

    </Box>
  );
}
