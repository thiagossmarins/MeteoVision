import 'react'
import LinearGradient from 'react-native-linear-gradient'
import { useAppTheme } from '../../hooks/useAppTheme'
import { GradientColors } from '../../theme/theme'
import { useAppSafeArea } from '../../hooks/useAppSafeArea'

interface GradientProps {
  gradient: GradientColors
  children?: React.ReactNode
}

export function GradientScreen({ children, gradient, ...rest }: GradientProps) {
  const { top, bottom } = useAppSafeArea();
  const theme = useAppTheme();

  return (
    <LinearGradient
      colors={theme.gradients[gradient]}
      {...rest}
      style={{
        flex: 1,
        paddingTop: Math.max(top),
        paddingBottom: Math.max(bottom),
        paddingHorizontal: 24
      }}>
      {children}
    </LinearGradient>
  )
}