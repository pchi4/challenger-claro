import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { colors, spacing } from "@/shared/theme";

interface AppTopBarProps {
  showBack?: boolean;
  onDelete?: () => void;
}

export function AppTopBar({
  showBack = true,
  onDelete
}: AppTopBarProps): React.JSX.Element {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {showBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={12}
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Ionicons name="chevron-back" size={32} color={colors.white} />
        </Pressable>
      ) : (
        <View style={styles.iconButton} />
      )}
      {onDelete ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Deletar"
          hitSlop={12}
          onPress={onDelete}
          style={styles.iconButton}
        >
          <Ionicons name="trash-outline" size={24} color={colors.white} />
        </Pressable>
      ) : (
        <View style={styles.iconButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: -spacing.sm
  }
});
