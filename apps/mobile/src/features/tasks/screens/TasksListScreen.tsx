import { FlatList, StyleSheet, View } from "react-native";
import {
  AppEmptyState,
  AppFloatingButton,
  AppLoadingState,
  AppScreen,
  TaskCard
} from "@/shared/components";
import { spacing } from "@/shared/theme";
import { TasksListFooter } from "@/features/tasks/components/TasksListFooter";
import { TasksListHeader } from "@/features/tasks/components/TasksListHeader";
import { useTasksListScreen } from "@/features/tasks/hooks/useTasksListScreen";

export function TasksListScreen(): React.JSX.Element {
  const screen = useTasksListScreen();

  return (
    <AppScreen>
      <FlatList
        data={screen.tasks}
        keyExtractor={(task) => task.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onEndReached={() => {
          screen.handleLoadMore();
        }}
        onEndReachedThreshold={0.35}
        ListHeaderComponent={
          <TasksListHeader
            total={screen.total}
            search={screen.search}
            status={screen.status}
            isTeamFiltered={screen.isTeamFiltered}
            teamId={screen.teamId}
            teamName={screen.teamName}
            onSearchChange={screen.handleSearchChange}
            onStatusChange={screen.handleStatusChange}
            onClearTeamFilter={screen.handleClearTeamFilter}
            onCreateTask={screen.handleCreateTask}
            onTeamsPress={screen.handleTeamsPress}
          />
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => screen.handleTaskPress(item.id)}
          />
        )}
        ItemSeparatorComponent={ListSeparator}
        ListEmptyComponent={
          screen.isLoading || screen.isError ? null : (
            <AppEmptyState
              title="Nenhuma tarefa por aqui"
              description="Crie uma tarefa ou ajuste os filtros para encontrar o que precisa."
            />
          )
        }
        ListFooterComponent={
          <TasksListFooter
            isLoading={screen.isLoading}
            isFetching={screen.isFetching}
            isError={screen.isError}
            errorMessage={screen.errorMessage}
            totalLoaded={screen.tasks.length}
            total={screen.total}
            canLoadMore={screen.canLoadMore}
            onRetry={() => {
              void screen.retry();
            }}
          />
        }
      />
      <AppFloatingButton
        label="Nova tarefa"
        icon="add"
        onPress={screen.handleCreateTask}
      />
    </AppScreen>
  );
}

function ListSeparator(): React.JSX.Element {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl * 3
  },
  separator: {
    height: spacing.md
  }
});
