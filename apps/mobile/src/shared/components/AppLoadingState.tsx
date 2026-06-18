import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors, spacing } from "@/shared/theme";

export function AppLoadingState(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl
  }
});
