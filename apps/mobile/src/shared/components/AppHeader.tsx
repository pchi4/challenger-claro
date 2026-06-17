import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../theme";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  centered?: boolean;
}

export function AppHeader({
  title,
  subtitle,
  action,
  centered = true
}: AppHeaderProps): React.JSX.Element {
  return (
    <View style={[styles.container, centered && styles.containerCentered]}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle !== undefined ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : null}
      </View>
      {action !== undefined ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md
  },
  containerCentered: {
    alignItems: "center",
    justifyContent: "center"
  },
  copy: {
    flex: 1,
    gap: spacing.xs
  },
  title: {
    color: colors.text,
    fontSize: typography.size.xxl,
    fontWeight: "800",
    lineHeight: typography.lineHeight.xl,
    textAlign: "center"
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
    textAlign: "center"
  },
  action: {
    flexShrink: 0
  }
});
