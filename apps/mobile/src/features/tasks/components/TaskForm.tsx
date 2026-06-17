import { Controller, Control, FieldErrors } from "react-hook-form";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  AppButton,
  AppFeedback,
  AppTextInput,
  TeamChip
} from "../../../shared/components";
import { colors, radius, spacing, typography } from "../../../shared/theme";
import { Team } from "../../teams/types/team.types";
import { TaskFormValues } from "../schemas/taskFormSchema";
import { TaskStatus } from "../types/task.types";

interface TaskFormProps {
  control: Control<TaskFormValues>;
  errors: FieldErrors<TaskFormValues>;
  teams: Team[];
  selectedTeamIds: string[];
  submitLabel: string;
  isSaving: boolean;
  onSubmit: () => void;
  onToggleTeam: (teamId: string) => void;
}

const statusOptions: Array<{
  label: string;
  value: TaskStatus;
}> = [
  {
    label: "Pendente",
    value: "PENDING"
  },
  {
    label: "Em progresso",
    value: "IN_PROGRESS"
  },
  {
    label: "Concluída",
    value: "DONE"
  }
];

export function TaskForm({
  control,
  errors,
  teams,
  selectedTeamIds,
  submitLabel,
  isSaving,
  onSubmit,
  onToggleTeam
}: TaskFormProps): React.JSX.Element {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
    >
      {isSaving ? (
        <AppFeedback message="Salvando tarefa..." variant="info" />
      ) : null}
      <Controller
        control={control}
        name="title"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppTextInput
            placeholder="Título da tarefa"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.title?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppTextInput
            placeholder="Detalhes da tarefa"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.description?.message}
            multiline
          />
        )}
      />
      <View style={styles.section}>
        <Text style={styles.label}>Status</Text>
        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <View style={styles.options}>
              {statusOptions.map((option) => (
                <SelectablePill
                  key={option.value}
                  label={option.label}
                  selected={value === option.value}
                  onPress={() => onChange(option.value)}
                />
              ))}
            </View>
          )}
        />
        {errors.status?.message !== undefined ? (
          <Text style={styles.error}>{errors.status.message}</Text>
        ) : null}
      </View>
      <Controller
        control={control}
        name="dueDate"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppTextInput
            placeholder="2026-06-20 ou 2026-06-20T00:00:00.000Z"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.dueDate?.message}
            autoCapitalize="none"
          />
        )}
      />
      <View style={styles.section}>
        <Text style={styles.label}>Times</Text>
        <Text style={styles.helper}>
          Selecione zero, um ou múltiplos times.
        </Text>
        <View style={styles.teams}>
          {teams.map((team) => (
            <Pressable
              key={team.id}
              accessibilityRole="button"
              onPress={() => onToggleTeam(team.id)}
              style={[
                styles.teamOption,
                selectedTeamIds.includes(team.id) && styles.teamOptionSelected
              ]}
            >
              <TeamChip name={team.name} colorHex={team.colorHex} />
            </Pressable>
          ))}
        </View>
      </View>
      <AppButton
        title={submitLabel}
        loading={isSaving}
        disabled={isSaving}
        onPress={onSubmit}
      />
    </ScrollView>
  );
}

interface SelectablePillProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function SelectablePill({
  label,
  selected,
  onPress
}: SelectablePillProps): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.pill, selected && styles.pillSelected]}
    >
      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xl
  },
  section: {
    gap: spacing.sm,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.input
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
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  pill: {
    minHeight: 36,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface
  },
  pillSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary
  },
  pillText: {
    color: colors.text,
    fontSize: typography.size.sm,
    fontWeight: "800"
  },
  pillTextSelected: {
    color: colors.white
  },
  error: {
    color: colors.danger,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  },
  teams: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  teamOption: {
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: radius.pill
  },
  teamOptionSelected: {
    borderColor: colors.primary
  }
});
