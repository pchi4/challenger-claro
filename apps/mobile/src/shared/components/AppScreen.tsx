import { PropsWithChildren } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp
} from "react-native";
import { colors, spacing } from "../theme";

interface AppScreenProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export function AppScreen({
  children,
  style,
  contentStyle
}: AppScreenProps): React.JSX.Element {
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flex: 1,
    padding: spacing.lg
  }
});
