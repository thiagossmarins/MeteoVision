import Svg, { Rect } from "react-native-svg";

export function HamburgerIcon() {
  return (
    <Svg width="20" height="14" viewBox="0 0 20 14" fill="none">
      <Rect width="20" height="2" rx="1" fill="white" />
      <Rect y="6" width="20" height="2" rx="1" fill="white" />
      <Rect y="12" width="20" height="2" rx="1" fill="white" />
    </Svg>
  );
}
