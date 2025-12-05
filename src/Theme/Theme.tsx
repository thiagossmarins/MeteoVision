import { createTheme } from "@shopify/restyle";


const pallete = {
  white: '#fff',
  black: '#000'
}

export const theme = createTheme({
  colors: {
    textColor: pallete.black,
  },
  spacing: {

  },
  borderRadii: {

  },
  textVariants: {
    defaults: {}
  }
})

export type Theme = typeof theme;