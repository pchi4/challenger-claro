import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/shared/theme";
import { AppHeader } from "@/shared/components/AppHeader";

interface AppFormScreenHeaderProps {
  title: string;
  subtitle: string;
  badgeLabel: string;
  icon: keyof typeof Ionicons.glyphMap;
  centered?: boolean;
}

export function AppFormScreenHeader({
  title,
  subtitle,
  badgeLabel,
  icon,
  centered = true
}: AppFormScreenHeaderProps): React.JSX.Element {
  return (
    <View style={[styles.container, centered && styles.containerCentered]}>
      <View style={styles.badge}>
        <Ionicons name={icon} size={16} color={colors.primary} />
        <Text style={styles.badgeText}>{badgeLabel}</Text>
      </View>
      <AppHeader title={title} subtitle={subtitle} centered={centered} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  containerCentered: {
    alignItems: "center"
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xs,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: "#133228"
  },
  badgeText: {
    color: colors.primary,
    fontSize: typography.size.sm,
    fontWeight: "800"
  }
});
