import { Pressable, StyleSheet, Text, View } from "react-native";
import { Task } from "@/features/tasks/types/task.types";
import { formatDatePtBr } from "@/shared/utils/formatDate";
import { colors, radius, spacing, typography } from "@/shared/theme";
import { StatusChip } from "@/shared/components/StatusChip";
import { TeamChip } from "@/shared/components/TeamChip";

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
}

export function TaskCard({ task, onPress }: TaskCardProps): React.JSX.Element {
  const content = (
    <>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.teamName}>
            {task.teams[0]?.name ?? "Sem time"}
          </Text>
        </View>
        <StatusChip status={task.status} />
      </View>
      {task.description !== undefined &&
      task.description !== null &&
      task.description.trim().length > 0 ? (
        <Text style={styles.description}>{task.description}</Text>
      ) : null}
      {task.dueDate !== undefined && task.dueDate !== null ? (
        <Text style={styles.dueDate}>Prazo: {formatDatePtBr(task.dueDate)}</Text>
      ) : null}
      {task.teams.length > 1 ? (
        <View style={styles.teams}>
          {task.teams.map((team) => (
            <TeamChip
              key={team.id}
              name={team.name}
              colorHex={team.colorHex}
            />
          ))}
        </View>
      ) : null}
    </>
  );

  if (onPress === undefined) {
    return <View style={styles.card}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.card}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.surface
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md
  },
  titleGroup: {
    flex: 1,
    gap: spacing.xs
  },
  title: {
    color: colors.text,
    fontSize: typography.size.lg,
    fontWeight: "800",
    lineHeight: typography.lineHeight.lg
  },
  teamName: {
    color: colors.muted,
    fontSize: typography.size.sm,
    fontWeight: "700",
    lineHeight: typography.lineHeight.sm
  },
  description: {
    color: colors.text,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md
  },
  dueDate: {
    color: colors.muted,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  },
  teams: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  }
});
