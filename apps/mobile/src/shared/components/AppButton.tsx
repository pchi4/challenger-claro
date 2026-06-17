import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle
} from "react-native";
import { colors, radius, spacing, typography } from "../theme";

type AppButtonVariant = "primary" | "secondary" | "danger";

interface AppButtonProps extends Omit<PressableProps, "style"> {
  title: string;
  variant?: AppButtonVariant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function AppButton({
  title,
  variant = "primary",
  loading = false,
  disabled,
  style,
  textStyle,
  ...props
}: AppButtonProps): React.JSX.Element {
  const isDisabled = disabled === true || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        variantStyles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <Text style={[styles.text, { color: textColors[variant] }, textStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const variantStyles: Record<AppButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.secondary
  },
  danger: {
    backgroundColor: colors.danger
  }
};

const textColors: Record<AppButtonVariant, string> = {
  primary: colors.white,
  secondary: colors.white,
  danger: colors.white
};

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md
  },
  pressed: {
    opacity: 0.82
  },
  disabled: {
    opacity: 0.56
  },
  text: {
    fontSize: typography.size.md,
    fontWeight: "800"
  }
});
