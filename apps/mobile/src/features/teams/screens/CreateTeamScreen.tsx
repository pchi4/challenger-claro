import { Controller } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  AppButton,
  AppFeedback,
  AppFormScreenHeader,
  AppScreen,
  AppTextInput,
  AppTopBar,
} from "@/shared/components";
import { spacing } from "@/shared/theme";
import { useCreateTeamScreen } from "@/features/teams/hooks/useCreateTeamScreen";

export function CreateTeamScreen(): React.JSX.Element {
  const screen = useCreateTeamScreen();

  return (
    <AppScreen contentStyle={styles.screen}>
      <AppTopBar />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <AppFormScreenHeader
            badgeLabel="Novo"
            icon="people-outline"
            title="Novo Time"
            subtitle="Crie um time para organizar as tarefas e liberar a navegacao para o fluxo principal."
          />
        </View>

        {screen.errorMessage && (
          <AppFeedback message={screen.errorMessage} variant="error" />
        )}

        {screen.isSaving && (
          <AppFeedback message="Criando time..." variant="info" />
        )}

        <Controller
          control={screen.control}
          name="name"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppTextInput
              label="Nome"
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
              label="Cor"
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
              label="Descrição"
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
    paddingTop: spacing.md,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  hero: {
    marginBottom: spacing.xl,
  },
  colorInput: {
    paddingRight: spacing.xl,
  },
});
