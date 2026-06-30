import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from "react-native";
import { colors, radius, spacing, typography } from "@/shared/theme";
import { formatDatePtBr } from "@/shared/utils/formatDate";

interface AppDateInputProps {
  label: string;
  value?: string;
  placeholder?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  onChange: (value: string) => void;
}

const weekdays = ["D", "S", "T", "Q", "Q", "S", "S"];

export function AppDateInput({
  label,
  value,
  placeholder = "Selecione uma data",
  error,
  containerStyle,
  onChange
}: Readonly<AppDateInputProps>): React.JSX.Element {
  const selectedDate = useMemo(() => parseDateValue(value), [value]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    getMonthStart(selectedDate ?? new Date())
  );
  const calendarDays = useMemo(
    () => buildCalendarDays(currentMonth),
    [currentMonth]
  );

  function openCalendar(): void {
    setCurrentMonth(getMonthStart(selectedDate ?? new Date()));
    setIsVisible(true);
  }

  function closeCalendar(): void {
    setIsVisible(false);
  }

  function handlePickDate(date: Date): void {
    onChange(toIsoDate(date));
    closeCalendar();
  }

  function handleClearDate(): void {
    onChange("");
    closeCalendar();
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable
        accessibilityRole="button"
        onPress={openCalendar}
        style={[
          styles.field,
          isVisible && styles.fieldFocused,
          error !== undefined && styles.fieldError
        ]}
      >
        <Text
          style={[
            styles.label,
            isVisible && styles.labelFocused,
            error !== undefined && styles.labelError
          ]}
        >
          {label}
        </Text>
        <View style={styles.fieldContent}>
          <View style={styles.valueGroup}>
            <Text
              style={[
                styles.value,
                selectedDate === undefined && styles.placeholderText
              ]}
            >
              {selectedDate === undefined ? placeholder : formatDatePtBr(value!)}
            </Text>
            <Text style={styles.helperText}>
              Toque para escolher no calendario
            </Text>
          </View>
          <View style={styles.iconBadge}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          </View>
        </View>
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}

      <Modal
        animationType="slide"
        transparent
        visible={isVisible}
        onRequestClose={closeCalendar}
      >
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.backdropPressable} onPress={closeCalendar} />
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar prazo</Text>
              <Pressable
                accessibilityRole="button"
                onPress={closeCalendar}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </Pressable>
            </View>

            <View style={styles.monthSwitcher}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setCurrentMonth(addMonths(currentMonth, -1))}
                style={styles.monthButton}
              >
                <Ionicons name="chevron-back" size={18} color={colors.text} />
              </Pressable>
              <Text style={styles.monthLabel}>
                {formatMonthLabel(currentMonth)}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}
                style={styles.monthButton}
              >
                <Ionicons name="chevron-forward" size={18} color={colors.text} />
              </Pressable>
            </View>

            <View style={styles.weekdaysRow}>
              {weekdays.map((weekday, index) => (
                <Text key={`${weekday}-${index}`} style={styles.weekday}>
                  {weekday}
                </Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <View key={`${currentMonth.getFullYear()}-${currentMonth.getMonth()}-empty-${index}`} style={styles.dayCell} />;
                }

                const isSelected =
                  selectedDate !== undefined && isSameDay(selectedDate, day);
                const isToday = isSameDay(day, new Date());

                return (
                  <Pressable
                    key={day.toISOString()}
                    accessibilityRole="button"
                    onPress={() => handlePickDate(day)}
                    style={[
                      styles.dayCell,
                      styles.dayButton,
                      isToday && styles.dayButtonToday,
                      isSelected && styles.dayButtonSelected
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayLabel,
                        isToday && styles.dayLabelToday,
                        isSelected && styles.dayLabelSelected
                      ]}
                    >
                      {day.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={handleClearDate}
                style={styles.secondaryAction}
              >
                <Text style={styles.secondaryActionText}>Remover data</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={closeCalendar}
                style={styles.primaryAction}
              >
                <Text style={styles.primaryActionText}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function buildCalendarDays(month: Date): Array<Date | null> {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const days: Array<Date | null> = [];

  for (let i = 0; i < firstDay.getDay(); i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, monthIndex, day));
  }

  return days;
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function formatMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric"
  }).format(date);
}

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function parseDateValue(value?: string): Date | undefined {
  if (value === undefined || value.trim().length === 0) {
    return undefined;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toIsoDate(date: Date): string {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  ).toISOString();
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    paddingTop: spacing.sm
  },
  field: {
    minHeight: 72,
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface
  },
  fieldFocused: {
    borderColor: colors.primary
  },
  fieldError: {
    borderColor: colors.danger
  },
  label: {
    position: "absolute",
    top: -9,
    left: spacing.sm,
    paddingHorizontal: spacing.xs,
    color: colors.muted,
    fontSize: typography.size.sm,
    fontWeight: "700",
    backgroundColor: colors.background
  },
  labelFocused: {
    color: colors.primary
  },
  labelError: {
    color: colors.danger
  },
  fieldContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  valueGroup: {
    flex: 1,
    gap: 2
  },
  value: {
    color: colors.text,
    fontSize: typography.size.md,
    fontWeight: "700"
  },
  placeholderText: {
    color: colors.muted,
    fontWeight: "500"
  },
  helperText: {
    color: colors.muted,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  },
  iconBadge: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: "#133228"
  },
  error: {
    color: colors.danger,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)"
  },
  backdropPressable: {
    flex: 1
  },
  modalCard: {
    gap: spacing.md,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  modalTitle: {
    color: colors.text,
    fontSize: typography.size.lg,
    fontWeight: "800"
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.surface
  },
  monthSwitcher: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  monthButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.surface
  },
  monthLabel: {
    color: colors.text,
    fontSize: typography.size.md,
    fontWeight: "800",
    textTransform: "capitalize"
  },
  weekdaysRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  weekday: {
    width: "14.28%",
    color: colors.muted,
    fontSize: typography.size.sm,
    fontWeight: "700",
    textAlign: "center"
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: spacing.sm
  },
  dayCell: {
    width: "14.28%",
    alignItems: "center",
    justifyContent: "center"
  },
  dayButton: {
    height: 42,
    borderRadius: radius.pill
  },
  dayButtonToday: {
    borderWidth: 1,
    borderColor: colors.primary
  },
  dayButtonSelected: {
    backgroundColor: colors.primary
  },
  dayLabel: {
    color: colors.text,
    fontSize: typography.size.sm,
    fontWeight: "700"
  },
  dayLabelToday: {
    color: colors.primary
  },
  dayLabelSelected: {
    color: colors.white
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  secondaryAction: {
    flex: 1,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface
  },
  secondaryActionText: {
    color: colors.text,
    fontSize: typography.size.md,
    fontWeight: "800"
  },
  primaryAction: {
    flex: 1,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.primary
  },
  primaryActionText: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: "800"
  }
});
