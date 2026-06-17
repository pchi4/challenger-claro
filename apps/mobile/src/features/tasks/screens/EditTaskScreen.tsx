import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import {
  AppErrorState,
  AppHeader,
  AppLoadingState,
  AppScreen,
  AppTopBar
} from "../../../shared/components";
import { colors, spacing } from "../../../shared/theme";
import { TaskForm } from "../components/TaskForm";
import { useTaskForm } from "../hooks/useTaskForm";

interface EditTaskScreenProps {
  taskId: string;
}

export function EditTaskScreen({
  taskId
}: EditTaskScreenProps): React.JSX.Element {
  const form = useTaskForm({
    mode: "edit",
    taskId
  });

  if (form.isLoading) {
    return (
      <AppScreen>
        <AppLoadingState />
      </AppScreen>
    );
  }

  if (form.isError) {
    return (
      <AppScreen>
        <AppErrorState message={form.errorMessage} retry={form.retry} />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <AppTopBar />
      <View style={styles.hero}>
        <Ionicons name="checkbox-outline" size={62} color={colors.primary} />
        <AppHeader
          title="Editar tarefa"
          subtitle="crie seu time para gerenciar as tarefas"
        />
      </View>
      <TaskForm
        control={form.control}
        errors={form.errors}
        teams={form.teams}
        selectedTeamIds={form.selectedTeamIds}
        submitLabel={form.submitLabel}
        isSaving={form.isSaving}
        onSubmit={form.submit}
        onToggleTeam={form.toggleTeam}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.lg
  }
});
