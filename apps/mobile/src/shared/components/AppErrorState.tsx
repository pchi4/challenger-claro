import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/shared/theme";
import { AppButton } from "@/shared/components/AppButton";

interface AppErrorStateProps {
  message: string;
  retry?: () => void;
}

export function AppErrorState({
  message,
  retry,
}: AppErrorStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Algo deu errado</Text>
      <Text style={styles.message}>{message}</Text>
      {retry ? <AppButton title="Tentar novamente" onPress={retry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: typography.size.lg,
    fontWeight: "800",
    textAlign: "center",
  },
  message: {
    color: colors.muted,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
    textAlign: "center",
  },
});
