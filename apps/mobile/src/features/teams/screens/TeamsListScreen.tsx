import { FlatList, StyleSheet, View } from "react-native";
import {
  AppButton,
  AppEmptyState,
  AppScreen
} from "@/shared/components";
import { spacing } from "@/shared/theme";
import { TeamListItem } from "@/features/teams/components/TeamListItem";
import { TeamsListFooter } from "@/features/teams/components/TeamsListFooter";
import { TeamsListHeader } from "@/features/teams/components/TeamsListHeader";
import { useTeamsListScreen } from "@/features/teams/hooks/useTeamsListScreen";

export function TeamsListScreen(): React.JSX.Element {
  const screen = useTeamsListScreen();

  return (
    <AppScreen>
      <FlatList
        data={screen.teams}
        keyExtractor={(team) => team.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <TeamsListHeader
            total={screen.total}
            search={screen.search}
            onSearchChange={screen.handleSearchChange}
            onViewAllTasks={screen.handleViewAllTasks}
          />
        }
        renderItem={({ item }) => (
          <TeamListItem
            team={item}
            onPress={() => screen.handleTeamPress(item.id, item.name)}
          />
        )}
        ItemSeparatorComponent={ListSeparator}
        ListEmptyComponent={
          screen.isLoading || screen.isError ? null : (
            <AppEmptyState
              title="Nenhum time cadastrado"
              description="Quando os times forem cadastrados, eles aparecerão aqui para filtrar as tarefas."
            />
          )
        }
        ListFooterComponent={
          <>
            <TeamsListFooter
              isLoading={screen.isLoading}
              isError={screen.isError}
              errorMessage={screen.errorMessage}
              onRetry={() => {
                void screen.retry();
              }}
            />
            <View style={styles.cta}>
              <AppButton title="Criar time" onPress={screen.handleCreateTeam} />
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
