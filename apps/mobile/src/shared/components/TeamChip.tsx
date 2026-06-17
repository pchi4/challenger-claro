import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../theme";

interface TeamChipProps {
  name: string;
  colorHex: string;
}

export function TeamChip({ name, colorHex }: TeamChipProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={[styles.swatch, { backgroundColor: colorHex }]} />
      <Text style={styles.text}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: radius.pill
  },
  text: {
    color: colors.text,
    fontSize: typography.size.sm,
    fontWeight: "700"
  }
});
