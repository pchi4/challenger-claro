import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/shared/theme";
import { TaskStatus } from "@/features/tasks/types/task.types";

export const taskStatusOptions: Array<{
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: TaskStatus;
}> = [
  {
    description: "A tarefa ainda nao comecou",
    icon: "time-outline",
    label: "Pendente",
    value: "PENDING"
  },
  {
    description: "O time ja esta trabalhando nela",
    icon: "sync-outline",
    label: "Em progresso",
    value: "IN_PROGRESS"
  },
  {
    description: "A entrega foi finalizada",
    icon: "checkmark-done-outline",
    label: "Concluída",
    value: "DONE"
  }
];

interface TaskStatusSelectorProps {
  selectedStatus: TaskStatus;
  error?: string;
  onChange: (status: TaskStatus) => void;
}

export function TaskStatusSelector({
  selectedStatus,
  error,
  onChange
}: TaskStatusSelectorProps): React.JSX.Element {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>Status</Text>
      <View style={styles.selectionList}>
        {taskStatusOptions.map((option) => (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.optionCard,
              selectedStatus === option.value && styles.optionCardSelected,
              pressed && styles.optionCardPressed
            ]}
          >
            <View style={styles.optionCardHeader}>
              <View
                style={[
                  styles.optionCardIcon,
                  selectedStatus === option.value && styles.optionCardIconSelected
                ]}
              >
                <Ionicons
                  name={option.icon}
                  size={18}
                  color={
                    selectedStatus === option.value ? colors.white : colors.muted
                  }
                />
              </View>
              <Ionicons
                name={
                  selectedStatus === option.value
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={18}
                color={
                  selectedStatus === option.value ? colors.primary : colors.muted
                }
              />
            </View>
            <Text
              style={[
                styles.optionCardTitle,
                selectedStatus === option.value && styles.optionCardTitleSelected
              ]}
            >
              {option.label}
            </Text>
            <Text
              style={[
                styles.optionCardDescription,
                selectedStatus === option.value &&
                  styles.optionCardDescriptionSelected
              ]}
            >
              {option.description}
            </Text>
          </Pressable>
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
  selectionList: {
    gap: spacing.sm
  },
  optionCard: {
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.background
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#0F2A22"
  },
  optionCardPressed: {
    opacity: 0.9
  },
  optionCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  optionCardIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.input
  },
  optionCardIconSelected: {
    backgroundColor: colors.primary
  },
  optionCardTitle: {
    color: colors.text,
    fontSize: typography.size.md,
    fontWeight: "800"
  },
  optionCardTitleSelected: {
    color: colors.white
  },
  optionCardDescription: {
    color: colors.muted,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
    paddingRight: spacing.lg
  },
  optionCardDescriptionSelected: {
    color: "#C9F4E6"
  },
  error: {
    color: colors.danger,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  }
});
