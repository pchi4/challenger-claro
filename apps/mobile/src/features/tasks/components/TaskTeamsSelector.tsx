import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/shared/theme";
import { Team } from "@/features/teams/types/team.types";

interface TaskTeamsSelectorProps {
  teams: Team[];
  selectedTeamIds: string[];
  onToggleTeam: (teamId: string) => void;
}

export function TaskTeamsSelector({
  teams,
  selectedTeamIds,
  onToggleTeam
}: TaskTeamsSelectorProps): React.JSX.Element {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>Times</Text>
      <Text style={styles.helper}>
        Selecione zero, um ou múltiplos times.
      </Text>
      <View style={styles.selectionList}>
        {teams.map((team) => (
          <Pressable
            key={team.id}
            accessibilityRole="button"
            onPress={() => onToggleTeam(team.id)}
            style={({ pressed }) => [
              styles.teamOption,
              selectedTeamIds.includes(team.id) && styles.teamOptionSelected,
              pressed && styles.teamOptionPressed
            ]}
          >
            <View
              style={[
                styles.teamOptionContent,
                selectedTeamIds.includes(team.id) &&
                  styles.teamOptionContentSelected
              ]}
            >
              <View style={styles.teamOptionInfo}>
                <View
                  style={[
                    styles.teamColorAccent,
                    {
                      backgroundColor: team.colorHex
                    }
                  ]}
                />
                <View style={styles.teamTextGroup}>
                  <Text style={styles.teamName}>{team.name}</Text>
                  <Text style={styles.teamHelper}>
                    {selectedTeamIds.includes(team.id)
                      ? "Vinculado a tarefa"
                      : "Toque para adicionar"}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.selectionIndicator,
                  selectedTeamIds.includes(team.id) &&
                    styles.selectionIndicatorSelected
                ]}
              >
                <Ionicons
                  name={selectedTeamIds.includes(team.id) ? "checkmark" : "add"}
                  size={16}
                  color={
                    selectedTeamIds.includes(team.id)
                      ? colors.white
                      : colors.muted
                  }
                />
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  label: {
    color: colors.text,
    fontSize: typography.size.sm,
    fontWeight: "700"
  },
  helper: {
    color: colors.muted,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  },
  selectionList: {
    gap: spacing.sm
  },
  teamOption: {
    borderRadius: radius.md
  },
  teamOptionSelected: {
    backgroundColor: "#0B1613"
  },
  teamOptionPressed: {
    opacity: 0.9
  },
  teamOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    minHeight: 72,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background
  },
  teamOptionContentSelected: {
    borderColor: colors.primary
  },
  teamOptionInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  teamColorAccent: {
    width: 10,
    alignSelf: "stretch",
    borderRadius: radius.pill
  },
  teamTextGroup: {
    flex: 1,
    gap: 2
  },
  teamName: {
    color: colors.text,
    fontSize: typography.size.md,
    fontWeight: "800"
  },
  teamHelper: {
    color: colors.muted,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  },
  selectionIndicator: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    backgroundColor: colors.surface
  },
  selectionIndicatorSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary
  }
});
