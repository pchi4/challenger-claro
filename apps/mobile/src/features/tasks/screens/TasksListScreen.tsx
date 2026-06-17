import { FlatList, StyleSheet, View } from "react-native";
import {
  AppButton,
  AppEmptyState,
  AppScreen,
  TaskCard
} from "../../../shared/components";
import { spacing } from "../../../shared/theme";
import { TasksListFooter } from "../components/TasksListFooter";
import { TasksListHeader } from "../components/TasksListHeader";
import { useTasksListScreen } from "../hooks/useTasksListScreen";

export function TasksListScreen(): React.JSX.Element {
  const screen = useTasksListScreen();

  return (
    <AppScreen>
      <FlatList
        data={screen.tasks}
        keyExtractor={(task) => task.id}
        contentContainerStyle={styles.listContent}
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
          <>
            <TasksListFooter
              isLoading={screen.isLoading}
              isFetching={screen.isFetching}
              isError={screen.isError}
              errorMessage={screen.errorMessage}
              canLoadMore={screen.canLoadMore}
              onLoadMore={screen.handleLoadMore}
              onRetry={() => {
                void screen.retry();
              }}
            />
            <View style={styles.cta}>
              <AppButton
                title="Nova Tarefa"
                onPress={screen.handleCreateTask}
              />
            </View>
          </>
        }
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
    paddingBottom: spacing.xl
  },
  separator: {
    height: spacing.md
  },
  cta: {
    marginTop: spacing.xl
  }
});
