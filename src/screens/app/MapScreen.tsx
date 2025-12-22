import React from "react";
import { Box } from "../../components/Box/Box";
import { MapView } from "@maplibre/maplibre-react-native";
import { StyleSheet } from "react-native";

export function MapScreen() {

  return (
    <Box flex={1} backgroundColor="black" justifyContent="center" alignItems="center">
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