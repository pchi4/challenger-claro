import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../theme";

type AppFeedbackVariant = "success" | "error" | "info";

interface AppFeedbackProps {
  message: string;
  variant?: AppFeedbackVariant;
}

const backgroundColors: Record<AppFeedbackVariant, string> = {
  success: "#DCFCE7",
  error: "#FEE2E2",
  info: "#DBEAFE"
};

const textColors: Record<AppFeedbackVariant, string> = {
  success: colors.success,
  error: colors.danger,
  info: colors.info
};

export function AppFeedback({
  message,
  variant = "info"
}: AppFeedbackProps): React.JSX.Element {
  return (
    <View style={[styles.container, { backgroundColor: backgroundColors[variant] }]}>
      <Text style={[styles.text, { color: textColors[variant] }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  text: {
    fontSize: typography.size.sm,
    fontWeight: "800",
    lineHeight: typography.lineHeight.sm
  }
});
