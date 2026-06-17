import { forwardRef } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import { colors, radius, spacing, typography } from "../theme";

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export const AppTextInput = forwardRef<TextInput, AppTextInputProps>(
  function AppTextInput(
    { label, error, containerStyle, labelStyle, style, ...props },
    ref
  ): React.JSX.Element {
    return (
      <View style={[styles.container, containerStyle]}>
        {label !== undefined && label.length > 0 ? (
          <Text style={[styles.label, labelStyle]}>{label}</Text>
        ) : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.muted}
          style={[styles.input, error !== undefined && styles.inputError, style]}
          {...props}
        />
        {error !== undefined ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs
  },
  label: {
    color: colors.text,
    fontSize: typography.size.sm,
    fontWeight: "700"
  },
  input: {
    minHeight: 48,
    borderWidth: 0,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    color: colors.text,
    backgroundColor: colors.input,
    fontSize: typography.size.md
  },
  inputError: {
    borderColor: colors.danger
  },
  error: {
    color: colors.danger,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  }
});
