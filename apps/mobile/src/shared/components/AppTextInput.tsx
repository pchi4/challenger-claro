import { forwardRef, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors, radius, spacing, typography } from "@/shared/theme";

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export const AppTextInput = forwardRef<TextInput, AppTextInputProps>(
  function AppTextInput(
    { label, error, containerStyle, labelStyle, style, ...props },
    ref,
  ): React.JSX.Element {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue =
      typeof props.value === "string" ? props.value.trim().length > 0 : false;
    const hasFloatingLabel =
      (label !== undefined && label.length > 0) || hasValue || isFocused;

    let computedPlaceholder: string | undefined;
    if (isFocused) {
      computedPlaceholder = props.placeholder;
    } else if (hasValue) {
      computedPlaceholder = undefined;
    } else {
      computedPlaceholder = props.placeholder;
    }

    return (
      <View style={[styles.container, containerStyle]}>
        <View
          style={[
            styles.field,
            isFocused && styles.fieldFocused,
            error !== undefined && styles.fieldError,
          ]}
        >
          {hasFloatingLabel ? (
            <Text
              style={[
                styles.label,
                isFocused && styles.labelFocused,
                error !== undefined && styles.labelError,
                labelStyle,
              ]}
            >
              {label ?? props.placeholder}
            </Text>
          ) : null}
          <TextInput
            ref={ref}
            placeholderTextColor={colors.muted}
            style={[
              styles.input,
              props.multiline === true && styles.inputMultiline,
              style,
            ]}
            onFocus={(event) => {
              setIsFocused(true);
              props.onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              props.onBlur?.(event);
            }}
            {...props}
            placeholder={computedPlaceholder}
          />
        </View>
        {error === undefined ? null : <Text style={styles.error}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  field: {
    position: "relative",
    minHeight: 58,
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  fieldFocused: {
    borderColor: colors.primary,
  },
  fieldError: {
    borderColor: colors.danger,
  },
  label: {
    position: "absolute",
    top: -9,
    left: spacing.sm,
    paddingHorizontal: spacing.xs,
    color: colors.muted,
    fontSize: typography.size.sm,
    fontWeight: "700",
    backgroundColor: colors.background,
  },
  labelFocused: {
    color: colors.primary,
  },
  labelError: {
    color: colors.danger,
  },
  input: {
    minHeight: 56,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    paddingHorizontal: 0,
    color: colors.text,
    fontSize: typography.size.md,
  },
  inputMultiline: {
    minHeight: 112,
    textAlignVertical: "top",
  },
  error: {
    color: colors.danger,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
  },
});
