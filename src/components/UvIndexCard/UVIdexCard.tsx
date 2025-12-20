import React, { useState } from "react";
import { LayoutChangeEvent } from "react-native";
import { Box } from "../Box/Box";
import { Text } from "../Text/Text";
import LinearGradient from "react-native-linear-gradient";


// Função auxiliar: interpolar cores
function interpolateColor(color1: string, color2: string, factor: number) {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 0xff;
  const g1 = (c1 >> 8) & 0xff;
  const b1 = c1 & 0xff;

  const r2 = (c2 >> 16) & 0xff;
  const g2 = (c2 >> 8) & 0xff;
  const b2 = c2 & 0xff;

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `rgb(${r}, ${g}, ${b})`;
}

interface UVIndexCardProps {
  uvValue: number;
}

export function UVIndexCard({ uvValue }: UVIndexCardProps) {
  const gradientColors = ["#00FF00", "#FFFF00", "#FF7F00", "#FF0000"];
  const segmentCount = gradientColors.length - 1;

  const [barWidth, setBarWidth] = useState(0);
  const ballSize = 28;

  const handleLayout = (e: LayoutChangeEvent) => {
    setBarWidth(e.nativeEvent.layout.width);
  };

  // posição da bola
  const ballPosition =
    barWidth > 0 ? (uvValue / 11) * (barWidth - ballSize) : 0;

  // cálculo da cor da bola
  const percentage = uvValue / 11;
  const segmentSize = 1 / segmentCount;

  const segmentIndex = Math.min(
    Math.floor(percentage / segmentSize),
    segmentCount - 1
  );

  const factor =
    (percentage - segmentIndex * segmentSize) / segmentSize;

  const ballColor = interpolateColor(
    gradientColors[segmentIndex],
    gradientColors[segmentIndex + 1],
    factor
  );

  return (

    <Box
      width="100%"
      height={24}
      mt="s20"
      justifyContent="center"
      onLayout={handleLayout}
      position="relative"
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: "100%",
          height: 16,
          borderRadius: 8,
        }}
      />

      <Box
        position="absolute"
        left={ballPosition}
        top={-1.5}
        width={ballSize}
        height={ballSize}
        borderRadius="s100"
        style={{
          backgroundColor: ballColor,
        }}
        borderWidth={3}
        borderColor={"textColor"}
        alignItems="center"
        justifyContent="center"
      >
        <Text preset="titleBoxFontSize" lineHeight={16} color="textColor" textAlign="center" width="100%" mr="s4">
          {uvValue.toFixed(0)}
        </Text>
      </Box>
    </Box>
  );
}
