import { Ionicons } from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  AppButton,
  AppFeedback,
  AppHeader,
  AppScreen,
  AppTextInput,
  AppTopBar
} from "../../../shared/components";
import { colors, spacing } from "../../../shared/theme";
import { useCreateTeamScreen } from "../hooks/useCreateTeamScreen";

export function CreateTeamScreen(): React.JSX.Element {
  const screen = useCreateTeamScreen();

  return (
    <AppScreen contentStyle={styles.screen}>
      <AppTopBar />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          <Ionicons name="people-outline" size={58} color={colors.primary} />
          <AppHeader
            title="Novo Time"
            subtitle="crie seu time para gerenciar as tarefas"
          />
        </View>

        {screen.errorMessage !== undefined ? (
          <AppFeedback message={screen.errorMessage} variant="error" />
        ) : null}
        {screen.isSaving ? (
          <AppFeedback message="Criando time..." variant="info" />
        ) : null}

        <Controller
          control={screen.control}
          name="name"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppTextInput
              placeholder="Nome do time"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={screen.errors.name?.message}
            />
          )}
        />
        <Controller
          control={screen.control}
          name="colorHex"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppTextInput
              placeholder="Cor do time"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={screen.errors.colorHex?.message}
              autoCapitalize="none"
              style={styles.colorInput}
            />
          )}
        />
        <Controller
          control={screen.control}
          name="description"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppTextInput
              placeholder="Descrição"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={screen.errors.description?.message}
            />
          )}
        />
        <AppButton
          title="Criar"
          loading={screen.isSaving}
          disabled={screen.isSaving}
          onPress={screen.submit}
        />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: spacing.md
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    gap: spacing.md,
    paddingBottom: spacing.xxl
  },
  hero: {
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xl
  },
  colorInput: {
    paddingRight: spacing.xl
  }
});
