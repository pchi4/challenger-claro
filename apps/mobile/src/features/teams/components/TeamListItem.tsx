import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/shared/theme";
import { Team } from "@/features/teams/types/team.types";

interface TeamListItemProps {
  team: Team;
  onPress: () => void;
}

export function TeamListItem({
  team,
  onPress
}: TeamListItemProps): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.teamItem}
    >
      <View style={styles.row}>
        <View style={styles.titleGroup}>
          <Ionicons name="people" size={34} color={team.colorHex} />
          <Text style={styles.teamName}>{team.name}</Text>
        </View>
        <View style={styles.actions}>
          <Ionicons name="chevron-forward" size={28} color={colors.white} />
        </View>
      </View>
      {team.description !== undefined && team.description !== null ? (
        <Text style={styles.teamDescription}>{team.description}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  teamItem: {
    minHeight: 96,
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.surface
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  titleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  teamName: {
    color: colors.text,
    fontSize: typography.size.lg,
    fontWeight: "700"
  },
  teamDescription: {
    color: colors.muted,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  }
});
