import { StyleSheet, View } from "react-native";
import { AppButton, AppHeader, AppTextInput } from "../../../shared/components";
import { spacing } from "../../../shared/theme";
import { TaskStatus } from "../types/task.types";
import { TaskStatusFilters } from "./TaskStatusFilters";
import { TeamFilterBanner } from "./TeamFilterBanner";

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
  return (
    <View style={styles.header}>
      <AppHeader
        title="Tarefas"
        subtitle="adicione a galera e separe os times"
        centered={false}
        action={
          <AppButton
            title="Times"
            variant="secondary"
            style={styles.headerButton}
            onPress={onTeamsPress}
          />
        }
      />
      <AppTextInput
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
  headerButton: {
    minHeight: 40,
    paddingHorizontal: spacing.sm
  }
});
