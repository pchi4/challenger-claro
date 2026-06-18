import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Control, FieldErrors, useForm } from "react-hook-form";
import { useTeams } from "@/features/teams/hooks/useTeams";
import { Team } from "@/features/teams/types/team.types";
import {
  taskFormSchema,
  TaskFormValues
} from "@/features/tasks/schemas/taskFormSchema";
import {
  CreateTaskPayload,
  TaskStatus,
  UpdateTaskPayload
} from "@/features/tasks/types/task.types";
import { useCreateTask } from "@/features/tasks/hooks/useCreateTask";
import { useTask } from "@/features/tasks/hooks/useTask";
import { useUpdateTask } from "@/features/tasks/hooks/useUpdateTask";

type TaskFormMode = "create" | "edit";

interface UseTaskFormOptions {
  mode: TaskFormMode;
  taskId?: string;
  contextTeamId?: string;
  contextTeamName?: string;
}

interface UseTaskFormResult {
  control: Control<TaskFormValues>;
  errors: FieldErrors<TaskFormValues>;
  teams: Team[];
  selectedTeamIds: string[];
  isLoading: boolean;
  isSaving: boolean;
  isError: boolean;
  errorMessage: string;
  submitLabel: string;
  contextTeamId?: string;
  contextTeamName?: string;
  toggleTeam: (teamId: string) => void;
  submit: () => void;
  retry: () => void;
}

const defaultValues: TaskFormValues = {
  title: "",
  description: "",
  status: "PENDING",
  dueDate: "",
  teamIds: []
};

export function useTaskForm({
  mode,
  taskId = "",
  contextTeamId,
  contextTeamName
}: UseTaskFormOptions): UseTaskFormResult {
  const router = useRouter();
  const teamsQuery = useTeams({
    limit: 100,
    offset: 0
  });
  const taskQuery = useTask(mode === "edit" ? taskId : "");
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    reset,
    setValue,
    watch
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues
  });
  const selectedTeamIds = watch("teamIds") ?? [];

  useEffect(() => {
    if (mode !== "edit" || taskQuery.data === undefined) {
      return;
    }

    const task = taskQuery.data.data;

    reset({
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      dueDate: task.dueDate ?? "",
      teamIds: task.teams.map((team) => team.id)
    });
  }, [mode, reset, taskQuery.data]);

  useEffect(() => {
    if (
      mode !== "create" ||
      contextTeamId === undefined ||
      selectedTeamIds.length > 0
    ) {
      return;
    }

    setValue("teamIds", [contextTeamId], {
      shouldDirty: false,
      shouldValidate: true
    });
  }, [contextTeamId, mode, selectedTeamIds.length, setValue]);

  function toggleTeam(teamId: string): void {
    const currentTeamIds = getValues("teamIds") ?? [];
    const nextTeamIds = currentTeamIds.includes(teamId)
      ? currentTeamIds.filter((id) => id !== teamId)
      : [...currentTeamIds, teamId];

    setValue("teamIds", nextTeamIds, {
      shouldDirty: true,
      shouldValidate: true
    });
  }

  const submit = handleSubmit((values) => {
    void saveTask(values);
  });

  async function saveTask(values: TaskFormValues): Promise<void> {
    if (mode === "create") {
      const response = await createTaskMutation.mutateAsync(
        toCreatePayload(values)
      );

      router.replace({
        pathname: "/tasks/[id]",
        params: {
          id: response.data.id,
          teamId: contextTeamId,
          teamName: contextTeamName
        }
      });
      return;
    }

    const response = await updateTaskMutation.mutateAsync({
      id: taskId,
      payload: toUpdatePayload(values)
    });

    router.replace({
      pathname: "/tasks/[id]",
      params: {
        id: response.data.id,
        teamId: contextTeamId,
        teamName: contextTeamName
      }
    });
  }

  function retry(): void {
    void teamsQuery.refetch();

    if (mode === "edit") {
      void taskQuery.refetch();
    }
  }

  return {
    control,
    errors,
    teams: teamsQuery.data?.data ?? [],
    selectedTeamIds,
    isLoading: teamsQuery.isLoading || (mode === "edit" && taskQuery.isLoading),
    isSaving: createTaskMutation.isPending || updateTaskMutation.isPending,
    isError: teamsQuery.isError || (mode === "edit" && taskQuery.isError),
    errorMessage:
      teamsQuery.error?.message ??
      taskQuery.error?.message ??
      "Não foi possível carregar o formulário.",
    submitLabel: mode === "create" ? "Criar tarefa" : "Salvar tarefa",
    contextTeamId,
    contextTeamName,
    toggleTeam,
    submit,
    retry
  };
}

function toCreatePayload(values: TaskFormValues): CreateTaskPayload {
  return {
    title: values.title.trim(),
    description: normalizeOptionalText(values.description),
    status: values.status as TaskStatus,
    dueDate: normalizeDueDate(values.dueDate),
    teamIds: values.teamIds ?? []
  };
}

function toUpdatePayload(values: TaskFormValues): UpdateTaskPayload {
  return toCreatePayload(values);
}

function normalizeOptionalText(value?: string): string | undefined {
  const trimmed = value?.trim();

  return trimmed === undefined || trimmed.length === 0 ? undefined : trimmed;
}

function normalizeDueDate(value?: string): string | undefined {
  const trimmed = value?.trim();

  if (trimmed === undefined || trimmed.length === 0) {
    return undefined;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T00:00:00.000Z`).toISOString();
  }

  return new Date(trimmed).toISOString();
}
