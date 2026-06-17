import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../../../shared/theme";
import { TaskStatus } from "../types/task.types";

const statusFilters: Array<{
  label: string;
  value: TaskStatus | undefined;
}> = [
  {
    label: "Todas",
    value: undefined
  },
  {
    label: "Pendentes",
    value: "PENDING"
  },
  {
    label: "Em progresso",
    value: "IN_PROGRESS"
  },
  {
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
    <View style={styles.filters}>
      {statusFilters.map((filter) => (
        <StatusFilterButton
          key={filter.label}
          label={filter.label}
          selected={selectedStatus === filter.value}
          onPress={() => onChange(filter.value)}
        />
      ))}
    </View>
  );
}

interface StatusFilterButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function StatusFilterButton({
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
      <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  filterButton: {
    minHeight: 36,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface
  },
  filterButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary
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
