import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/shared/theme";
import { TaskStatus } from "@/features/tasks/types/task.types";

const statusFilters: Array<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: TaskStatus | undefined;
}> = [
  {
    icon: "layers-outline",
    label: "Todas",
    value: undefined
  },
  {
    icon: "time-outline",
    label: "Pendentes",
    value: "PENDING"
  },
  {
    icon: "sync-outline",
    label: "Em progresso",
    value: "IN_PROGRESS"
  },
  {
    icon: "checkmark-done-outline",
    label: "Concluídas",
    value: "DONE"
  }
];

interface TaskStatusFiltersProps {
  selectedStatus?: TaskStatus;
  onChange: (status: TaskStatus | undefined) => void;
}

export function TaskStatusFilters({
  selectedStatus,
  onChange
}: TaskStatusFiltersProps): React.JSX.Element {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filters}
    >
      {statusFilters.map((filter) => (
        <StatusFilterButton
          key={filter.label}
          icon={filter.icon}
          label={filter.label}
          selected={selectedStatus === filter.value}
          onPress={() => onChange(filter.value)}
        />
      ))}
    </ScrollView>
  );
}

interface StatusFilterButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  selected: boolean;
  onPress: () => void;
}

function StatusFilterButton({
  icon,
  label,
  selected,
  onPress
}: StatusFilterButtonProps): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.filterButton, selected && styles.filterButtonSelected]}
    >
      <View style={[styles.iconBadge, selected && styles.iconBadgeSelected]}>
        <Ionicons
          name={icon}
          size={16}
          color={selected ? colors.white : colors.muted}
        />
      </View>
      <View style={styles.textGroup}>
        <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filters: {
    gap: spacing.sm,
    paddingRight: spacing.lg
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingLeft: spacing.sm,
    paddingRight: spacing.md,
    backgroundColor: colors.surface
  },
  filterButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: "#123B32"
  },
  iconBadge: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.input
  },
  iconBadgeSelected: {
    backgroundColor: colors.primary
  },
  textGroup: {
    justifyContent: "center"
  },
  filterText: {
    color: colors.text,
    fontSize: typography.size.sm,
    fontWeight: "800"
  },
  filterTextSelected: {
    color: colors.white
  }
});
