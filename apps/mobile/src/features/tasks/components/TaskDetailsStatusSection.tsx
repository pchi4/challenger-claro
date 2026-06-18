import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/shared/theme";
import { TaskStatus } from "@/features/tasks/types/task.types";

const statusLabels: Record<TaskStatus, string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em progresso",
  DONE: "Concluída"
};

interface TaskDetailsStatusSectionProps {
  currentStatus: TaskStatus;
  isDeleting: boolean;
  isUpdatingStatus: boolean;
  statusOptions: TaskStatus[];
  onChange: (status: TaskStatus) => void;
}

export function TaskDetailsStatusSection({
  currentStatus,
  isDeleting,
  isUpdatingStatus,
  statusOptions,
  onChange
}: TaskDetailsStatusSectionProps): React.JSX.Element {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Alterar status</Text>
      <Text style={styles.sectionSubtitle}>
        Escolha o estado atual da tarefa. A seleção ativa fica destacada.
      </Text>
      <View style={styles.statusActions}>
        {statusOptions.map((status) => (
          <Pressable
            key={status}
            accessibilityRole="button"
            disabled={
              currentStatus === status || isUpdatingStatus || isDeleting
            }
            style={({ pressed }) => [
              styles.statusCardButton,
              currentStatus === status && styles.statusCardButtonSelected,
              currentStatus !== status &&
                (isUpdatingStatus || isDeleting) &&
                styles.statusCardButtonDisabled,
              pressed &&
                currentStatus !== status &&
                !isUpdatingStatus &&
                !isDeleting &&
                styles.statusCardButtonPressed
            ]}
            onPress={() => onChange(status)}
          >
            <View style={styles.statusCardContent}>
              <View
                style={[
                  styles.statusCardIcon,
                  currentStatus === status && styles.statusCardIconSelected
                ]}
              >
                {isUpdatingStatus && currentStatus !== status ? (
                  <ActivityIndicator
                    color={currentStatus === status ? colors.white : colors.primary}
                  />
                ) : (
                  <Ionicons
                    name={getStatusIcon(status)}
                    size={18}
                    color={currentStatus === status ? colors.white : colors.muted}
                  />
                )}
              </View>
              <View style={styles.statusCardTextGroup}>
                <Text
                  style={[
                    styles.statusCardTitle,
                    currentStatus === status && styles.statusCardTitleSelected
                  ]}
                >
                  {statusLabels[status]}
                </Text>
                <Text
                  style={[
                    styles.statusCardDescription,
                    currentStatus === status &&
                      styles.statusCardDescriptionSelected
                  ]}
                >
                  {isUpdatingStatus && currentStatus !== status
                    ? "Atualizando status..."
                    : getStatusDescription(status)}
                </Text>
              </View>
              <Ionicons
                name={
                  currentStatus === status ? "radio-button-on" : "radio-button-off"
                }
                size={18}
                color={currentStatus === status ? colors.primary : colors.muted}
              />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function getStatusDescription(status: TaskStatus): string {
  switch (status) {
    case "PENDING":
      return "A tarefa segue na fila, pronta para ser priorizada.";
    case "IN_PROGRESS":
      return "O trabalho foi iniciado e ainda esta em andamento.";
    case "DONE":
      return "A entrega foi concluida e validada.";
  }
}

function getStatusIcon(status: TaskStatus): keyof typeof Ionicons.glyphMap {
  switch (status) {
    case "PENDING":
      return "time-outline";
    case "IN_PROGRESS":
      return "sync-outline";
    case "DONE":
      return "checkmark-done-outline";
  }
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.surface
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.size.md,
    fontWeight: "800"
  },
  sectionSubtitle: {
    color: colors.muted,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  },
  statusActions: {
    gap: spacing.sm
  },
  statusCardButton: {
    minHeight: 0,
    alignItems: "stretch",
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 0,
    backgroundColor: colors.surface
  },
  statusCardButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: "#123B32"
  },
  statusCardButtonDisabled: {
    opacity: 0.72
  },
  statusCardButtonPressed: {
    opacity: 0.88
  },
  statusCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md
  },
  statusCardIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.input
  },
  statusCardIconSelected: {
    backgroundColor: colors.primary
  },
  statusCardTextGroup: {
    flex: 1,
    gap: 2
  },
  statusCardTitle: {
    color: colors.text,
    fontSize: typography.size.md,
    fontWeight: "800"
  },
  statusCardTitleSelected: {
    color: colors.white
  },
  statusCardDescription: {
    color: colors.muted,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  },
  statusCardDescriptionSelected: {
    color: "#C9F4E6"
  }
});
