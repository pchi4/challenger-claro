import { Controller } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  AppButton,
  AppErrorState,
  AppFeedback,
  AppFormScreenHeader,
  AppLoadingState,
  AppScreen,
  AppTextInput,
  AppTopBar
} from "@/shared/components";
import { spacing } from "@/shared/theme";
import { useEditTeamScreen } from "@/features/teams/hooks/useEditTeamScreen";

export function EditTeamScreen(): React.JSX.Element {
  const screen = useEditTeamScreen();

  if (screen.isLoading) {
    return (
      <AppScreen>
        <AppLoadingState />
      </AppScreen>
    );
  }

  if (screen.errorMessage !== undefined && screen.isSaving === false && screen.isDeleting === false) {
    return (
      <AppScreen>
        <AppErrorState message={screen.errorMessage} />
      </AppScreen>
    );
  }

  return (
    <AppScreen contentStyle={styles.screen}>
      <AppTopBar onDelete={screen.handleDelete} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <AppFormScreenHeader
            badgeLabel="Edição"
            icon="create-outline"
            title="Editar time"
            subtitle="Atualize os dados do time e mantenha os filtros e vínculos organizados."
          />
        </View>

        {screen.isSaving ? (
          <AppFeedback message="Salvando time..." variant="info" />
        ) : null}
        {screen.isDeleting ? (
          <AppFeedback message="Deletando time..." variant="info" />
        ) : null}

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
          title="Salvar alterações"
          loading={screen.isSaving}
          disabled={screen.isSaving || screen.isDeleting}
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
    marginBottom: spacing.xl
  },
  colorInput: {
    paddingRight: spacing.xl
  }
});
