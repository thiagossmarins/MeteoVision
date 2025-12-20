import React, { useMemo, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import Svg, { Circle, Path, Line } from "react-native-svg";
import { Box } from "../Box/Box";

interface SolarDeclinationProps {
  sunrise: string; // HH:MM:SS format
  sunset: string;  // HH:MM:SS format
  testMode?: boolean; // Enable test mode to see animation
}

export function SolarDeclination({
  sunrise,
  sunset,
  testMode = false,
}: SolarDeclinationProps) {
  const { width } = Dimensions.get("window");
  const graphWidth = width - 48;
  const graphHeight = 200;
  const padding = 20;
  const plotWidth = graphWidth - padding * 2;
  const plotHeight = graphHeight - padding * 2;

  const [currentPos, setCurrentPos] = useState<{ x: number; y: number; progress: number } | null>(null);

  const parseTime = (timeStr: string): number => {
    // Extrair apenas HH:MM de formatos como "2024-01-15T05:30:00" ou "05:30:00" ou "05:30"
    const timeOnly = timeStr.includes("T") ? timeStr.split("T")[1] : timeStr;
    const parts = timeOnly.split(":");
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };

  const { sunriseMinutes, sunsetMinutes, sunPoints } = useMemo(() => {
    const sunrise_min = parseTime(sunrise);
    const sunset_min = parseTime(sunset);
    const totalDayMinutes = sunset_min - sunrise_min;

    // Generate points along the sun path (altitude variation throughout the day)
    // Using a parabolic curve to simulate sun altitude
    const points: Array<{ x: number; y: number; time: number }> = [];
    const steps = 48; // Generate points every 30 minutes

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const timeMinutes = sunrise_min + progress * totalDayMinutes;

      // Parabolic curve for sun altitude (0 at sunrise/sunset, max at noon)
      const altitude = Math.sin(progress * Math.PI);

      const x = padding + progress * plotWidth;
      const y = padding + plotHeight - altitude * plotHeight;

      points.push({ x, y, time: timeMinutes });
    }

    return {
      sunriseMinutes: sunrise_min,
      sunsetMinutes: sunset_min,
      sunPoints: points,
    };
  }, [sunrise, sunset, padding, plotWidth, plotHeight]);

  // Update current position based on current time
  useEffect(() => {
    const updatePosition = () => {
      if (sunriseMinutes === undefined || sunsetMinutes === undefined) return;

      const now = new Date();
      // Usar horário local, não UTC
      let currentMinutes = now.getHours() * 60 + now.getMinutes();
      const totalDayMinutes = sunsetMinutes - sunriseMinutes;

      // Log para debug
      console.log(`[SolarDeclination] Hora atual: ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
      console.log(`[SolarDeclination] Nascer: ${Math.floor(sunriseMinutes / 60)}:${String(sunriseMinutes % 60).padStart(2, '0')}`);
      console.log(`[SolarDeclination] Pôr: ${Math.floor(sunsetMinutes / 60)}:${String(sunsetMinutes % 60).padStart(2, '0')}`);
      console.log(`[SolarDeclination] Minutos atuais: ${currentMinutes}, Nascer: ${sunriseMinutes}, Pôr: ${sunsetMinutes}`);

      // Test mode: simula o movimento do sol ao longo do dia
      if (testMode) {
        // Cria uma animação contínua de 10 segundos para o dia todo
        const elapsed = (Date.now() % 10000) / 10000;
        currentMinutes = sunriseMinutes + elapsed * totalDayMinutes;
        console.log(`[SolarDeclination] Test mode ativado, minutos: ${currentMinutes}`);
      }

      // Só mostrar o círculo se estiver entre nascer e pôr
      // Fora desse intervalo, o círculo desaparece
      if (currentMinutes < sunriseMinutes || currentMinutes > sunsetMinutes) {
        console.log(`[SolarDeclination] Sol fora do intervalo. Esperado entre ${sunriseMinutes} e ${sunsetMinutes}, mas é ${currentMinutes}`);
        setCurrentPos(null);
        return;
      }

      // Calcular a posição REAL do sol na curva
      const progress = (currentMinutes - sunriseMinutes) / totalDayMinutes;

      // Calculate position on the curve
      const altitude = Math.sin(progress * Math.PI);
      const x = padding + progress * plotWidth;
      const y = padding + plotHeight - altitude * plotHeight;

      console.log(`[SolarDeclination] Sol visível! Progress: ${(progress * 100).toFixed(1)}%`);
      setCurrentPos({ x, y, progress });
    };

    updatePosition();
    const interval = setInterval(updatePosition, 500); // Update every 500ms for smooth movement

    return () => clearInterval(interval);
  }, [sunriseMinutes, sunsetMinutes, plotWidth, plotHeight, padding, testMode]);

  // Create path string for the curve
  const curvePath = useMemo(() => {
    if (sunPoints.length === 0) return "";

    let pathStr = `M ${sunPoints[0].x} ${sunPoints[0].y}`;

    for (let i = 1; i < sunPoints.length; i++) {
      const curr = sunPoints[i];
      const prev = sunPoints[i - 1];
      const controlX = (prev.x + curr.x) / 2;
      const controlY = (prev.y + curr.y) / 2;

      pathStr += ` Q ${controlX} ${controlY} ${curr.x} ${curr.y}`;
    }

    return pathStr;
  }, [sunPoints]);

  return (
    <Box width={"100%"} marginBottom="s16" justifyContent="center" alignItems="center">
      <Svg width={graphWidth} height={graphHeight}>
        {/* Grid background */}
        <Line
          x1={padding}
          y1={padding + plotHeight}
          x2={graphWidth - padding}
          y2={padding + plotHeight}
          stroke="rgba(200, 200, 200, 0.2)"
          strokeWidth="1"
        />



        {/* Sun altitude curve */}
        <Path
          d={curvePath}
          stroke="rgba(255, 180, 0, 0.9)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Fill under curve with gradient effect */}
        <Path
          d={`${curvePath} L ${graphWidth - padding} ${padding + plotHeight} L ${padding} ${padding + plotHeight} Z`}
          fill="rgba(255, 180, 0, 0.1)"
        />

        {/* Current sun position with animation effect */}
        {currentPos && (
          <>
            {/* Glow effect */}
            <Circle
              cx={currentPos.x}
              cy={currentPos.y}
              r="12"
              fill="none"
              stroke="rgba(255, 220, 0, 0.3)"
              strokeWidth="2"
            />
            {/* Main circle */}
            <Circle
              cx={currentPos.x}
              cy={currentPos.y}
              r="8"
              fill="rgba(255, 180, 0, 1)"
            />
            {/* Inner highlight */}
            <Circle
              cx={currentPos.x}
              cy={currentPos.y}
              r="5"
              fill="rgba(255, 220, 100, 0.8)"
            />
          </>
        )}

        {/* Time labels on X-axis */}
      </Svg>
    </Box>
  );
}
