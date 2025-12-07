import 'react'
import LinearGradient from 'react-native-linear-gradient'
import { useAppTheme } from '../../hooks/useAppTheme'
import { GradientColors } from '../../theme/theme'

interface GradientProps {
  gradient: GradientColors
  children?: React.ReactNode
}

export function Gradient({ children, gradient, ...rest }: GradientProps) {
  const theme = useAppTheme();

  return (
    <LinearGradient
      colors={theme.gradients[gradient]}
      {...rest}
      style={{flex: 1}}
    >
      {children}
    </LinearGradient>
  )
}