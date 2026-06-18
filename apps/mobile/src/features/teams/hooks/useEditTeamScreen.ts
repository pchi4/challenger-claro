import { Alert } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Control, FieldErrors, useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  teamFormSchema,
  TeamFormValues
} from "@/features/teams/schemas/teamFormSchema";
import {
  CreateTeamPayload,
  UpdateTeamPayload
} from "@/features/teams/types/team.types";
import { useDeleteTeam } from "@/features/teams/hooks/useDeleteTeam";
import { useTeam } from "@/features/teams/hooks/useTeam";
import { useUpdateTeam } from "@/features/teams/hooks/useUpdateTeam";

interface UseEditTeamScreenResult {
  control: Control<TeamFormValues>;
  errors: FieldErrors<TeamFormValues>;
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  errorMessage?: string;
  submit: () => void;
  handleDelete: () => void;
}

export function useEditTeamScreen(): UseEditTeamScreenResult {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const teamId = normalizeParam(params.id) ?? "";
  const teamQuery = useTeam(teamId);
  const updateTeamMutation = useUpdateTeam();
  const deleteTeamMutation = useDeleteTeam();
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      colorHex: "#C6FF00",
      description: ""
    }
  });

  useEffect(() => {
    if (teamQuery.data === undefined) {
      return;
    }

    reset({
      name: teamQuery.data.data.name,
      colorHex: teamQuery.data.data.colorHex,
      description: teamQuery.data.data.description ?? ""
    });
  }, [reset, teamQuery.data]);

  const submit = handleSubmit((values) => {
    void updateTeamMutation
      .mutateAsync({
        id: teamId,
        payload: toUpdatePayload(values)
      })
      .then(() => {
        router.replace("/teams");
      });
  });

  function handleDelete(): void {
    Alert.alert("Deletar time", "Essa ação não pode ser desfeita.", [
      {
        text: "Cancelar",
        style: "cancel"
      },
      {
        text: "Deletar",
        style: "destructive",
        onPress: () => {
          void deleteTeamMutation.mutateAsync(teamId).then(() => {
            router.replace("/teams");
          });
        }
      }
    ]);
  }

  return {
    control,
    errors,
    isLoading: teamQuery.isLoading,
    isSaving: updateTeamMutation.isPending,
    isDeleting: deleteTeamMutation.isPending,
    errorMessage:
      teamQuery.error?.message ??
      updateTeamMutation.error?.message ??
      deleteTeamMutation.error?.message,
    submit,
    handleDelete
  };
}

function toUpdatePayload(values: TeamFormValues): UpdateTeamPayload {
  return toPayload(values);
}

function toPayload(values: TeamFormValues): CreateTeamPayload {
  const description = values.description?.trim();

  return {
    name: values.name.trim(),
    colorHex: values.colorHex.trim(),
    description:
      description === undefined || description.length === 0
        ? undefined
        : description
  };
}

function normalizeParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
