import React from "react";
import { BoxProps, createBox } from "@shopify/restyle";
import { Theme } from '../../theme/Theme';

const GlassBoxBase = createBox<Theme>();

interface GlassBoxProps extends BoxProps<Theme> {
  children?: React.ReactNode
}

export function GlassBox({ children, ...rest }: GlassBoxProps) {
  return (
    <GlassBoxBase
      borderRadius="s16"
      overflow="hidden"
      backgroundColor="glassBackground"
      paddingHorizontal="s16"
      paddingVertical="s8"
      {...rest}
    >
      {children}
    </GlassBoxBase>
  );
}
