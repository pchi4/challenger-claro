import { StyleSheet, View } from "react-native";
import {
  AppButton,
  AppErrorState,
  AppLoadingState
} from "../../../shared/components";
import { spacing } from "../../../shared/theme";

interface TasksListFooterProps {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage: string;
  canLoadMore: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
}

export function TasksListFooter({
  isLoading,
  isFetching,
  isError,
  errorMessage,
  canLoadMore,
  onLoadMore,
  onRetry
}: TasksListFooterProps): React.JSX.Element | null {
  if (isLoading) {
    return <AppLoadingState />;
  }

  if (isError) {
    return <AppErrorState message={errorMessage} retry={onRetry} />;
  }

  if (!canLoadMore) {
    return null;
  }

  return (
    <View style={styles.footer}>
      <AppButton
        title="Carregar mais"
        variant="secondary"
        loading={isFetching}
        onPress={onLoadMore}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingTop: spacing.lg
  }
});
