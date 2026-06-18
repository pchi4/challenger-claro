import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/shared/components";
import { colors, radius, spacing, typography } from "@/shared/theme";

interface TeamFilterBannerProps {
  teamLabel: string;
  onClear?: () => void;
  label?: string;
  actionLabel?: string;
}

export function TeamFilterBanner({
  teamLabel,
  onClear,
  label = "Filtrando por time",
  actionLabel = "Limpar"
}: TeamFilterBannerProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.textGroup}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.name}>{teamLabel}</Text>
      </View>
      <View style={styles.actions}>
        {onClear ? (
          <AppButton
            title={actionLabel}
            variant="secondary"
            onPress={onClear}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        ) : null}
      </View>
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
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
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
