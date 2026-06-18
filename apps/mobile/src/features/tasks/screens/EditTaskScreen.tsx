import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import {
  AppFormScreenHeader,
  AppErrorState,
  AppLoadingState,
  AppScreen,
  AppTopBar
} from "@/shared/components";
import { TeamFilterBanner } from "@/features/tasks/components/TeamFilterBanner";
import { spacing } from "@/shared/theme";
import { TaskForm } from "@/features/tasks/components/TaskForm";
import { useTaskForm } from "@/features/tasks/hooks/useTaskForm";

interface EditTaskScreenProps {
  taskId: string;
}

export function EditTaskScreen({
  taskId
}: EditTaskScreenProps): React.JSX.Element {
  const router = useRouter();
  const params = useLocalSearchParams<{
    teamId?: string | string[];
    teamName?: string | string[];
  }>();
  const contextTeamId = normalizeParam(params.teamId);
  const contextTeamName = normalizeParam(params.teamName);
  const form = useTaskForm({
    mode: "edit",
    taskId,
    contextTeamId,
    contextTeamName
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
        <AppFormScreenHeader
          badgeLabel="Edicao"
          icon="create-outline"
          title="Editar tarefa"
          subtitle="Atualize prazo, status e times com a mesma hierarquia visual das outras telas."
          centered={false}
        />
      </View>
      {form.contextTeamName ? (
        <View style={styles.contextBanner}>
          <TeamFilterBanner
            teamLabel={form.contextTeamName}
            label="Voce esta editando no time"
            actionLabel="Ver tarefas"
            onClear={() =>
              router.push({
                pathname: "/tasks",
                params: {
                  teamId: form.contextTeamId,
                  teamName: form.contextTeamName
                }
              })
            }
          />
        </View>
      ) : null}
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
    marginTop: spacing.md,
    marginBottom: spacing.lg
  },
  contextBanner: {
    marginBottom: spacing.md
  }
});

function normalizeParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
