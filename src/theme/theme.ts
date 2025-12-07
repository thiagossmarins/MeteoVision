import { createTheme } from "@shopify/restyle";


const pallete = {
  white: '#fff',
  black: '#000'
}

export const theme = createTheme({
  colors: {
    textColor: pallete.white,
  },
  gradients: {
    clear: ['#4A90E2', '#9FBDE0'],
    clouds: ['#a0a0a0ff', '#535353ff'],
    night: ['#141E30', '#243B55'],
    rain: ['#628696', '#246368'],
  },
  spacing: {
    s8: 8,
    s10: 10,
    s12: 12,
    s16: 16,
    s20: 20,
    s24: 24,
    s32: 32,
  },
  borderRadii: {

  },
  textVariants: {
    defaults: {}
  }
})

export type Theme = typeof theme;
export type GradientColors = keyof typeof theme.gradients