import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode
}

export function Button({ children, style, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    height: 50,
    width: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)"
  }
})