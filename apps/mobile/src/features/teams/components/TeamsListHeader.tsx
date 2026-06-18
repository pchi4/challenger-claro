import { StyleSheet, View } from "react-native";
import { AppButton, AppHeader, AppTextInput } from "@/shared/components";
import { spacing } from "@/shared/theme";

interface TeamsListHeaderProps {
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  onViewAllTasks: () => void;
}

export function TeamsListHeader({
  total,
  search,
  onSearchChange,
  onViewAllTasks
}: TeamsListHeaderProps): React.JSX.Element {
  return (
    <View style={styles.header}>
      <AppHeader
        title="Times"
        subtitle="Acesse um dos times"
        action={
          <AppButton
            title="Todas tarefas"
            variant="secondary"
            style={styles.actionButton}
            onPress={onViewAllTasks}
          />
        }
        centered={false}
      />
      <AppTextInput
        label="Buscar time"
        placeholder="Busque um time"
        value={search}
        onChangeText={onSearchChange}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.lg,
    marginBottom: spacing.lg
  },
  actionButton: {
    minHeight: 40,
    paddingHorizontal: spacing.md
  }
});
