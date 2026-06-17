import { StyleSheet, View } from "react-native";
import { AppHeader, AppTextInput } from "../../../shared/components";
import { spacing } from "../../../shared/theme";

interface TeamsListHeaderProps {
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
}

export function TeamsListHeader({
  total,
  search,
  onSearchChange
}: TeamsListHeaderProps): React.JSX.Element {
  return (
    <View style={styles.header}>
      <AppHeader
        title="Times"
        subtitle="Acesse um dos times"
      />
      <AppTextInput
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
  }
});
