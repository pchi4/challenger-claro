import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Control, FieldErrors, useForm } from "react-hook-form";
import {
  teamFormSchema,
  TeamFormValues
} from "../schemas/teamFormSchema";
import { CreateTeamPayload } from "../types/team.types";
import { useCreateTeam } from "./useCreateTeam";

interface UseCreateTeamScreenResult {
  control: Control<TeamFormValues>;
  errors: FieldErrors<TeamFormValues>;
  isSaving: boolean;
  errorMessage?: string;
  submit: () => void;
}

export function useCreateTeamScreen(): UseCreateTeamScreenResult {
  const router = useRouter();
  const createTeamMutation = useCreateTeam();
  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      colorHex: "#C6FF00",
      description: ""
    }
  });

  const submit = handleSubmit((values) => {
    void createTeamMutation.mutateAsync(toPayload(values)).then(() => {
      router.replace("/teams");
    });
  });

  return {
    control,
    errors,
    isSaving: createTeamMutation.isPending,
    errorMessage: createTeamMutation.error?.message,
    submit
  };
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
