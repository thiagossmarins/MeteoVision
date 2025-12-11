import React from "react";
import { createText } from "@shopify/restyle";
import { Theme } from "../../theme/Theme";
import { TextStyle } from 'react-native'

const RestyleText = createText<Theme>();
type RestyleTextProps = React.ComponentProps<typeof RestyleText>
interface TextProps extends RestyleTextProps {
  preset: TextVariants,
  light?: boolean,
  regular?: boolean,
  medium?: boolean,
  bold?: boolean,
  italic?: boolean
}

export function Text({ children, preset = "smallFontSize", light, regular, medium, bold, italic, style, ...restyleTextProps }: TextProps) {

  const fontFamily = getFontFamily(light, regular, medium, bold, italic);

  return (

    /* ...restyleTextProps serve para repassar todas as props restantes para o componente filho
    por exemplo, quando formos passas color, a gente não precisa tipar, porque isso foi para o ...restyleTextProps
    */
    <RestyleText color="textColor" style={[$fontSize[preset], { fontFamily }, style]} {...restyleTextProps}> {children}</RestyleText >
  )
}

function getFontFamily(light?: boolean, regular?: boolean, medium?: boolean, bold?: boolean, italic?: boolean) {
  // o switch(true) permite testar expressões booleanas em cada case
  switch (true) {
    case light && italic:
      return $fontFamily.lightItalic;
    case light:
      return $fontFamily.light;
    case medium && italic:
      return $fontFamily.mediumItalic;
    case medium:
      return $fontFamily.medium;
    case bold && italic:
      return $fontFamily.boldItalic;
    case bold:
      return $fontFamily.bold;
    default:
      return $fontFamily.regular; // ou qualquer valor padrão
  }
}

type TextVariants =
  | "bigFontSize"
  | "mediumFontSize"
  | "smallFontSize";

// Podemos mapear interfaces usando o Record, passamos nosso tipo e depois as propriedades que queremos
const $fontSize: Record<TextVariants, TextStyle> = {
  bigFontSize: { fontSize: 100, lineHeight: 100 },
  mediumFontSize: { fontSize: 24 },
  smallFontSize: { fontSize: 16 }
}

const $fontFamily = {
  light: "Inter_Light",
  lightItalic: "Inter_LightItalic",
  regular: "Inter_Regular",
  medium: "Inter_Medium",
  mediumItalic: "Inter_MediumItalic",
  bold: "Inter_Bold",
  boldItalic: "Inter_BoldItalic",
}