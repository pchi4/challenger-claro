import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  AppButton,
  AppEmptyState,
  AppErrorState,
  AppFeedback,
  AppHeader,
  AppLoadingState,
  AppScreen,
  AppTopBar,
  StatusChip,
  TeamChip
} from "@/shared/components";
import { TeamFilterBanner } from "@/features/tasks/components/TeamFilterBanner";
import { colors, radius, spacing, typography } from "@/shared/theme";
import { TaskDetailsStatusSection } from "@/features/tasks/components/TaskDetailsStatusSection";
import { useTaskDetailsScreen } from "@/features/tasks/hooks/useTaskDetailsScreen";

export function TaskDetailsScreen(): React.JSX.Element {
  const screen = useTaskDetailsScreen();

  if (screen.isLoading) {
    return (
      <AppScreen>
        <AppLoadingState />
      </AppScreen>
    );
  }

  if (screen.isError) {
    return (
      <AppScreen>
        <AppErrorState
          message={screen.errorMessage}
          retry={() => {
            void screen.retry();
          }}
        />
      </AppScreen>
    );
  }

  if (screen.isEmpty || screen.task === undefined) {
    return (
      <AppScreen>
        <AppEmptyState
          title="Tarefa não encontrada"
          description="Essa tarefa pode ter sido removida ou não está disponível."
        />
      </AppScreen>
    );
  }

  const task = screen.task;

  return (
    <AppScreen contentStyle={styles.screenContent}>
      <View style={styles.topBar}>
        <AppTopBar />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          title="Detalhe da tarefa"
          subtitle="Acompanhe status, prazo e times vinculados."
        />
        {screen.contextTeamName ? (
          <TeamFilterBanner
            teamLabel={screen.contextTeamName}
            label="Voce esta navegando no time"
            actionLabel="Ver tarefas"
            onClear={screen.handleBackToTeamTasks}
          />
        ) : null}
        {screen.feedbackMessage === undefined ? null : (
          <AppFeedback
            message={screen.feedbackMessage}
            variant={screen.feedbackVariant}
          />
        )}
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>{screen.task.title}</Text>
            <StatusChip status={screen.task.status} />
          </View>

          {screen.task.description !== undefined &&
          screen.task.description !== null &&
          screen.task.description.trim().length > 0 ? (
            <Text style={styles.description}>{screen.task.description}</Text>
          ) : (
            <Text style={styles.mutedText}>Sem descrição.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prazo</Text>
          <Text style={styles.sectionValue}>
            {screen.formattedDueDate ?? "Sem prazo definido"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Times</Text>
          {screen.task.teams.length > 0 ? (
            <View style={styles.chips}>
              {screen.task.teams.map((team) => (
                <TeamChip
                  key={team.id}
                  name={team.name}
                  colorHex={team.colorHex}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.mutedText}>Nenhum time vinculado.</Text>
          )}
        </View>

        <TaskDetailsStatusSection
          currentStatus={task.status}
          isDeleting={screen.isDeleting}
          isUpdatingStatus={screen.isUpdatingStatus}
          statusOptions={screen.statusOptions}
          onChange={screen.handleStatusChange}
        />

        <View style={styles.actions}>
          <AppButton
            title="Editar tarefa"
            variant="secondary"
            disabled={screen.isDeleting || screen.isUpdatingStatus}
            onPress={screen.handleEdit}
          />
          <AppButton
            title="Deletar tarefa"
            variant="danger"
            loading={screen.isDeleting}
            disabled={screen.isUpdatingStatus}
            onPress={() => {
              Alert.alert(
                "Deletar tarefa",
                "Essa ação não pode ser desfeita.",
                [
                  {
                    text: "Cancelar",
                    style: "cancel"
                  },
                  {
                    text: "Deletar",
                    style: "destructive",
                    onPress: () => {
                      void screen.handleDelete();
                    }
                  }
                ]
              );
            }}
          />
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    padding: 0
  },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md
  },
  content: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xl
  },
  header: {
    gap: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.surface
  },
  titleGroup: {
    gap: spacing.sm
  },
  title: {
    color: colors.text,
    fontSize: typography.size.xl,
    fontWeight: "800",
    lineHeight: typography.lineHeight.xl
  },
  description: {
    color: colors.text,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md
  },
  mutedText: {
    color: colors.muted,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md
  },
  section: {
    gap: spacing.sm,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.surface
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.size.md,
    fontWeight: "800"
  },
  sectionValue: {
    color: colors.muted,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  actions: {
    gap: spacing.sm
  }
});
