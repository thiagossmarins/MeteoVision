import MapView, { Region } from "react-native-maps";
import { RefObject } from "react";

// Limites seguros do MapView — ultrapassar esses valores causa crash nativo
const MAX_LAT_DELTA = 170;
const MAX_LNG_DELTA = 340;

/**
 * Anima o mapa em 3 etapas:
 * 1. Zoom out na origem
 * 2. Pan com zoom aberto até o destino
 * 3. Zoom in no destino
 */
export function flyToRegion(
  mapRef: RefObject<MapView | null>,
  origin: Region,
  destination: { latitude: number; longitude: number }
) {
  const latSpan = Math.abs(origin.latitude - destination.latitude);
  const lngSpan = Math.abs(origin.longitude - destination.longitude);

  const zoomOutLat = Math.min(Math.max(latSpan * 3, 10), MAX_LAT_DELTA);
  const zoomOutLng = Math.min(Math.max(lngSpan * 3, 10), MAX_LNG_DELTA);

  // Passo 1: zoom out mantendo câmera na origem
  mapRef.current?.animateToRegion(
    { ...origin, latitudeDelta: zoomOutLat, longitudeDelta: zoomOutLng },
    800
  );

  // Passo 2: pan para o destino com zoom aberto
  setTimeout(() => {
    mapRef.current?.animateToRegion(
      {
        latitude: destination.latitude,
        longitude: destination.longitude,
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
        latitude: destination.latitude,
        longitude: destination.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1200
    );
  }, 2000);
}

/**
 * Anima direto para o destino com zoom in (sem voo)
 */
export function zoomToRegion(
  mapRef: RefObject<MapView | null>,
  destination: { latitude: number; longitude: number }
) {
  mapRef.current?.animateToRegion(
    {
      latitude: destination.latitude,
      longitude: destination.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    },
    1500
  );
}
