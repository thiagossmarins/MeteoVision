import { createTheme } from "@shopify/restyle";


const pallete = {
  blue: '#2196F3',
  gray: '#ccc',
  white: '#fff',
  black: '#000',
  glass: 'rgba(224, 224, 224, 0.2)'
}

export const theme = createTheme({
  colors: {
    glassBackground: pallete.glass,
    humidityBox: pallete.gray,
    humidity: pallete.blue,
    textColor: pallete.white,
    textColorBlack: pallete.black,
  },
  gradients: {
    clear: ['#4A90E2', '#9FBDE0'],
    clouds: ['#a0a0a0ff', '#535353ff'],
    night: ['#141E30', '#243B55'],
    rain: ['#628696', '#246368'],
  },
  spacing: {
    s2: 2,
    s4: 4,
    s8: 8,
    s10: 10,
    s12: 12,
    s16: 16,
    s20: 20,
    s24: 24,
    s32: 32,
    s48: 48,
    s80: 80,
  },
  borderRadii: {
    s8: 8,
    s16: 16,
    s100: 100,
  },
  textVariants: {
    defaults: {}
  }
})

export type Theme = typeof theme;
export type GradientColors = keyof typeof theme.gradients