import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { TaskStatus } from "../../features/tasks/types/task.types";
import { colors, radius, spacing, typography } from "../theme";

interface StatusChipProps {
  status: TaskStatus;
}

const statusLabels: Record<TaskStatus, string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em progresso",
  DONE: "Concluída"
};

const statusStyles: Record<TaskStatus, ViewStyle> = {
  PENDING: {
    backgroundColor: "#FEF3C7"
  },
  IN_PROGRESS: {
    backgroundColor: "#DBEAFE"
  },
  DONE: {
    backgroundColor: "#DCFCE7"
  }
};

const statusTextColors: Record<TaskStatus, string> = {
  PENDING: colors.warning,
  IN_PROGRESS: colors.info,
  DONE: colors.success
};

export function StatusChip({ status }: StatusChipProps): React.JSX.Element {
  return (
    <View style={[styles.container, statusStyles[status]]}>
      <Text style={[styles.text, { color: statusTextColors[status] }]}>
        {statusLabels[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 28,
    justifyContent: "center",
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  text: {
    fontSize: typography.size.sm,
    fontWeight: "800"
  }
});
