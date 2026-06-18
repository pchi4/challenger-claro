import { Ionicons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { Pressable } from "react-native";
import { colors, radius, spacing, typography } from "@/shared/theme";

interface AppFloatingButtonProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function AppFloatingButton({
  label,
  icon = "add",
  onPress,
  style
}: AppFloatingButtonProps): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        style
      ]}
    >
      <Ionicons name={icon} size={20} color={colors.white} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 12
    },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 8
  },
  pressed: {
    opacity: 0.86
  },
  label: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: "800"
  }
});
