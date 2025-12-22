import React from "react";
import { Box } from "../../components/Box/Box";
import { MapView } from "@maplibre/maplibre-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "../../assets/icons/ArrowLeftIcon";

export function MapScreen() {
  const navigation = useNavigation<any>();


  return (
    <Box flex={1} backgroundColor="black" justifyContent="center" alignItems="center">
      
      <Box flexDirection="row" width={"100%"}>
        <TouchableOpacity onPress={() => {navigation.goBack()}} style={{ position: 'absolute', top: 40, left: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 25, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
          <ArrowLeftIcon />
        </TouchableOpacity>
      </Box>
      
      <MapView
        style={style.map}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
      />
    </Box>
  );
}

const style = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});