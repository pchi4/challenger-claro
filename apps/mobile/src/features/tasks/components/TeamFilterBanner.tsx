import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../../shared/components";
import { colors, radius, spacing, typography } from "../../../shared/theme";

interface TeamFilterBannerProps {
  teamLabel: string;
  onClear: () => void;
}

export function TeamFilterBanner({
  teamLabel,
  onClear
}: TeamFilterBannerProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.textGroup}>
        <Text style={styles.label}>Filtrando por time</Text>
        <Text style={styles.name}>{teamLabel}</Text>
      </View>
      <AppButton
        title="Limpar"
        variant="secondary"
        onPress={onClear}
        style={styles.button}
        textStyle={styles.buttonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.surface
  },
  textGroup: {
    flex: 1,
    gap: spacing.xs
  },
  label: {
    color: colors.muted,
    fontSize: typography.size.sm,
    fontWeight: "700"
  },
  name: {
    color: colors.text,
    fontSize: typography.size.md,
    fontWeight: "800"
  },
  button: {
    minHeight: 36,
    paddingHorizontal: spacing.sm
  },
  buttonText: {
    fontSize: typography.size.sm
  }
});
