import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton, AppHeader, AppTextInput } from "@/shared/components";
import { colors, radius, spacing, typography } from "@/shared/theme";
import { TaskStatus } from "@/features/tasks/types/task.types";
import { TaskStatusFilters } from "@/features/tasks/components/TaskStatusFilters";
import { TeamFilterBanner } from "@/features/tasks/components/TeamFilterBanner";

interface TasksListHeaderProps {
  total: number;
  search: string;
  status?: TaskStatus;
  isTeamFiltered: boolean;
  teamId?: string;
  teamName?: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: TaskStatus | undefined) => void;
  onClearTeamFilter: () => void;
  onCreateTask: () => void;
  onTeamsPress: () => void;
}

export function TasksListHeader({
  total,
  search,
  status,
  isTeamFiltered,
  teamId,
  teamName,
  onSearchChange,
  onStatusChange,
  onClearTeamFilter,
  onCreateTask,
  onTeamsPress
}: TasksListHeaderProps): React.JSX.Element {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroBadge}>
            <Ionicons name="grid-outline" size={14} color={colors.primary} />
            <Text style={styles.heroBadgeText}>Painel de tarefas</Text>
          </View>
          <View style={styles.headerActions}>
            {isTeamFiltered && teamId ? (
              <AppButton
                title="Editar time"
                variant="secondary"
                style={styles.headerButton}
                textStyle={styles.headerButtonText}
                onPress={() => {
                  router.push(`/teams/${teamId}/edit` as Href);
                }}
              />
            ) : null}
            <AppButton
              title="Times"
              variant="secondary"
              style={styles.headerButton}
              textStyle={styles.headerButtonText}
              onPress={onTeamsPress}
            />
          </View>
        </View>

        <AppHeader
          title="Tarefas"
          subtitle={
            isTeamFiltered
              ? "Acompanhe o trabalho do time selecionado e refine a lista com busca e status."
              : "Acompanhe todas as tarefas ou aplique filtros por busca, status e time."
          }
          centered={false}
        />

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{total}</Text>
            <Text style={styles.metricLabel}>tarefas visiveis</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricHighlight}>
            <Ionicons name="funnel-outline" size={16} color={colors.primary} />
            <Text style={styles.metricHighlightText}>
              {status === undefined ? "Sem filtro de status" : "Filtro ativo"}
            </Text>
          </View>
        </View>
      </View>

      <AppTextInput
        label="Buscar tarefa"
        placeholder="Buscar por título ou descrição"
        value={search}
        onChangeText={onSearchChange}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {isTeamFiltered ? (
        <TeamFilterBanner
          teamLabel={teamName ?? teamId ?? ""}
          onClear={onClearTeamFilter}
          actionLabel="Trocar time"
        />
      ) : null}
      <TaskStatusFilters selectedStatus={status} onChange={onStatusChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.md,
    marginBottom: spacing.lg
  },
  hero: {
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.surface
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xs,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: "#133228"
  },
  heroBadgeText: {
    color: colors.primary,
    fontSize: typography.size.sm,
    fontWeight: "800"
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.background
  },
  metricCard: {
    gap: 2
  },
  metricValue: {
    color: colors.text,
    fontSize: typography.size.xl,
    fontWeight: "800"
  },
  metricLabel: {
    color: colors.muted,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  },
  metricDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: colors.border
  },
  metricHighlight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  metricHighlightText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.size.sm,
    fontWeight: "700",
    lineHeight: typography.lineHeight.sm
  },
  headerButton: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background
  },
  headerButtonText: {
    fontSize: typography.size.sm
  }
});
