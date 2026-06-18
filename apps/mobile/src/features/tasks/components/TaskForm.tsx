import { Controller, Control, FieldErrors } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  AppButton,
  AppDateInput,
  AppFeedback,
  AppTextInput
} from "@/shared/components";
import { spacing } from "@/shared/theme";
import { TaskStatusSelector } from "@/features/tasks/components/TaskStatusSelector";
import { TaskTeamsSelector } from "@/features/tasks/components/TaskTeamsSelector";
import { Team } from "@/features/teams/types/team.types";
import { TaskFormValues } from "@/features/tasks/schemas/taskFormSchema";

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
      showsVerticalScrollIndicator={false}
    >
      {isSaving ? (
        <AppFeedback message="Salvando tarefa..." variant="info" />
      ) : null}
      <Controller
        control={control}
        name="title"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppTextInput
            label="Título"
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
            label="Descrição"
            placeholder="Detalhes da tarefa"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.description?.message}
            multiline
            style={styles.descriptionInput}
          />
        )}
      />
      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => (
          <TaskStatusSelector
            selectedStatus={value}
            error={errors.status?.message}
            onChange={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="dueDate"
        render={({ field: { onChange, value } }) => (
          <AppDateInput
            label="Prazo"
            placeholder="Escolha a data limite"
            value={value}
            onChange={onChange}
            error={errors.dueDate?.message}
          />
        )}
      />
      <TaskTeamsSelector
        teams={teams}
        selectedTeamIds={selectedTeamIds}
        onToggleTeam={onToggleTeam}
      />
      <AppButton
        title={submitLabel}
        loading={isSaving}
        disabled={isSaving}
        onPress={onSubmit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xl
  },
  descriptionInput: {
    minHeight: 120
  }
});
