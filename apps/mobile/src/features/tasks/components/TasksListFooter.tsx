import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { AppErrorState, AppLoadingState } from "@/shared/components";
import { colors, spacing, typography } from "@/shared/theme";

interface TasksListFooterProps {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage: string;
  totalLoaded: number;
  total: number;
  canLoadMore: boolean;
  onRetry: () => void;
}

export function TasksListFooter({
  isLoading,
  isFetching,
  isError,
  errorMessage,
  totalLoaded,
  total,
  canLoadMore,
  onRetry
}: TasksListFooterProps): React.JSX.Element | null {
  if (isLoading) {
    return <AppLoadingState />;
  }

  if (isError) {
    return <AppErrorState message={errorMessage} retry={onRetry} />;
  }

  if (totalLoaded === 0) {
    return null;
  }

  return (
    <View style={styles.footer}>
      <Text style={styles.statusText}>
        {canLoadMore
          ? `Mostrando ${totalLoaded} de ${total} tarefas`
          : `${totalLoaded} tarefas carregadas`}
      </Text>
      {isFetching && canLoadMore ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.loadingText}>Carregando mais tarefas...</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    gap: spacing.sm,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md
  },
  statusText: {
    color: colors.muted,
    fontSize: typography.size.sm,
    fontWeight: "700",
    textAlign: "center"
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  loadingText: {
    color: colors.text,
    fontSize: typography.size.sm,
    fontWeight: "700"
  }
});
