import React from "react";
import { createText } from "@shopify/restyle";
import { Theme } from "../../Theme/Theme";
import {} from 'react-native'

const RestyleText = createText<Theme>();
type RestyleTextProps = React.ComponentProps<typeof RestyleText>

export function Text({children, ...restyleTextProps}: RestyleTextProps) {
  return (
    <RestyleText {...restyleTextProps}>{children}</RestyleText>
  )
}