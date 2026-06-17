import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../theme";

interface AppEmptyStateProps {
  title: string;
  description: string;
}

export function AppEmptyState({
  title,
  description
}: AppEmptyStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.xl
  },
  title: {
    color: colors.text,
    fontSize: typography.size.lg,
    fontWeight: "800",
    textAlign: "center"
  },
  description: {
    color: colors.muted,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
    textAlign: "center"
  }
});
