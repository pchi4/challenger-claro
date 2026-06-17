export const colors = {
  background: "#1F2026",
  surface: "#2A2B31",
  input: "#101114",
  text: "#F8FAFC",
  muted: "#8D8E9B",
  primary: "#079669",
  primaryPressed: "#047857",
  secondary: "#2A2B31",
  danger: "#DC2626",
  border: "#35363D",
  success: "#8BC53F",
  warning: "#C8AA35",
  info: "#60D8F7",
  white: "#FFFFFF"
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40
} as const;

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  pill: 999
} as const;

export const typography = {
  size: {
    xs: 11,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 28,
    xxxl: 36
  },
  lineHeight: {
    sm: 16,
    md: 24,
    lg: 28,
    xl: 32
  }
} as const;
