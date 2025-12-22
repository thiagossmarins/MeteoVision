import React, { useRef, useState } from "react";
import { Box } from "../../components/Box/Box";
import { MapView, Camera } from "@maplibre/maplibre-react-native";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "../../assets/icons/ArrowLeftIcon";
import { Text } from "../../components/Text/Text";

// Interface que define a estrutura de um pin no mapa
// Cada pin tem um ID único, latitude e longitude do ponto clicado
interface Pin {
  id: string;
  latitude: number;
  longitude: number;
}

export function MapScreen() {
  // Hook para usar a navegação e voltar para a tela anterior
  const navigation = useNavigation<any>();

  // Referência para o componente MapView, pode ser usada para controlar o mapa programaticamente
  const mapRef = useRef<any>(null);

  // Estado que armazena o pin atual selecionado no mapa
  // Sempre que clica em um novo local, substitui o pin anterior
  const [pins, setPins] = useState<Pin[]>([]);

  // Função que é executada quando o usuário clica em um local no mapa
  const handleMapPress = async (event: any) => {
    try {
      // Extrai as coordenadas do ponto clicado
      const { geometry } = event;
      // geometry.coordinates vem no formato [longitude, latitude], por isso a ordem inversa
      const latitude = geometry.coordinates[1];
      const longitude = geometry.coordinates[0];

      // Cria um novo pin com as coordenadas capturadas
      const newPin: Pin = {
        id: "current-pin", // ID fixo para sempre substituir o anterior
        latitude,
        longitude,
      };

      // Atualiza o estado com apenas o novo pin (substitui o anterior)
      setPins([newPin]);
      // Log para debugar e ver as coordenadas exatas no console
      console.log(`Pin adicionado em: Latitude ${latitude}, Longitude ${longitude}`);
    } catch (error) {
      // Caso algo dê errado na captura, mostra o erro no console
      console.error("Erro ao adicionar pin:", error);
    }
  };

  return (
    <Box flex={1} backgroundColor="black" justifyContent="center" alignItems="center">

      <Box flexDirection="row" width={"100%"} height={150} justifyContent="center" gap="s16" alignItems="center" zIndex={1}>
        <TouchableOpacity
          onPress={() => { navigation.goBack() }}
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 25, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
        >
          <ArrowLeftIcon />
        </TouchableOpacity>

        <TextInput
          placeholder="Pesquisar localização"
          placeholderTextColor="#FFFFFF"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', width: "80%", borderRadius: 25, height: 40, paddingHorizontal: 16, color: '#FFFFFF' }}
        />
      </Box>

      <Box flex={1} width={"100%"} justifyContent="flex-end" alignItems="flex-end" overflow="hidden" borderRadius="s32">
        <MapView
          ref={mapRef}
          style={style.map}
          mapStyle="https://tiles.openfreemap.org/styles/liberty"
          onPress={handleMapPress} // Detecta cliques no mapa
        >
          {/* Renderiza câmera para cada pin (move a visualização do mapa para o pin) */}
          {pins.map((pin) => (
            <Camera
              key={pin.id}
              centerCoordinate={[pin.longitude, pin.latitude]}
              zoomLevel={14}
              animationDuration={0}
            />
          ))}
        </MapView>

        {/* Card de informações - só aparece quando há um pin selecionado */}
        {pins.length > 0 && (
          <Box
            position="absolute"
            bottom={20}
            left={20}
            right={20}
            backgroundColor="black"
            padding="s16"
            borderRadius="s16"
          >
            {/* Exibe as coordenadas do pin atual */}
            {pins.map((pin) => (
              <Box key={pin.id} marginBottom="s8">
                <Text preset="smallFontSize" color="white">
                  📍 Lat: {pin.latitude.toFixed(4)}, Lng: {pin.longitude.toFixed(4)}
                </Text>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// Estilos do mapa - define que o mapa ocupa 80% da altura da tela
const style = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});