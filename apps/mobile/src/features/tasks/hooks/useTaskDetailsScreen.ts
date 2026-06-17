import { useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { formatDatePtBr } from "../../../shared/utils/formatDate";
import { TaskStatus } from "../types/task.types";
import { useDeleteTask } from "./useDeleteTask";
import { useTask } from "./useTask";
import { useUpdateTaskStatus } from "./useUpdateTaskStatus";

const statusOptions: TaskStatus[] = ["PENDING", "IN_PROGRESS", "DONE"];

export function useTaskDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const taskId = normalizeParam(params.id) ?? "";
  const taskQuery = useTask(taskId);
  const updateTaskStatusMutation = useUpdateTaskStatus();
  const deleteTaskMutation = useDeleteTask();
  const task = taskQuery.data?.data;

  const formattedDueDate = useMemo(() => {
    if (task?.dueDate === undefined || task.dueDate === null) {
      return undefined;
    }

    return formatDatePtBr(task.dueDate);
  }, [task?.dueDate]);

  function handleStatusChange(status: TaskStatus): void {
    if (taskId.length === 0 || task?.status === status) {
      return;
    }

    updateTaskStatusMutation.mutate({
      id: taskId,
      status
    });
  }

  function handleEdit(): void {
    if (taskId.length === 0) {
      return;
    }

    router.push({
      pathname: "/tasks/[id]/edit",
      params: {
        id: taskId
      }
    });
  }

  async function handleDelete(): Promise<void> {
    if (taskId.length === 0) {
      return;
    }

    await deleteTaskMutation.mutateAsync(taskId);
    router.replace("/tasks");
  }

  return {
    task,
    taskId,
    statusOptions,
    formattedDueDate,
    isLoading: taskQuery.isLoading,
    isError: taskQuery.isError,
    isEmpty: !taskQuery.isLoading && !taskQuery.isError && task === undefined,
    isUpdatingStatus: updateTaskStatusMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    feedbackMessage: getFeedbackMessage(
      updateTaskStatusMutation.isPending,
      updateTaskStatusMutation.isSuccess,
      updateTaskStatusMutation.isError,
      deleteTaskMutation.isPending,
      deleteTaskMutation.isError
    ),
    feedbackVariant: getFeedbackVariant(
      updateTaskStatusMutation.isSuccess,
      updateTaskStatusMutation.isError || deleteTaskMutation.isError
    ),
    errorMessage:
      taskQuery.error?.message ??
      updateTaskStatusMutation.error?.message ??
      deleteTaskMutation.error?.message ??
      "Não foi possível carregar a tarefa.",
    retry: taskQuery.refetch,
    handleStatusChange,
    handleEdit,
    handleDelete
  };
}

function getFeedbackMessage(
  isUpdatingStatus: boolean,
  didUpdateStatus: boolean,
  didFailStatus: boolean,
  isDeleting: boolean,
  didFailDelete: boolean
): string | undefined {
  if (isUpdatingStatus) {
    return "Atualizando status...";
  }

  if (isDeleting) {
    return "Deletando tarefa...";
  }

  if (didFailStatus) {
    return "Não foi possível alterar o status.";
  }

  if (didFailDelete) {
    return "Não foi possível deletar a tarefa.";
  }

  if (didUpdateStatus) {
    return "Status atualizado.";
  }

  return undefined;
}

function getFeedbackVariant(
  didUpdateStatus: boolean,
  didFail: boolean
): "success" | "error" | "info" {
  if (didFail) {
    return "error";
  }

  if (didUpdateStatus) {
    return "success";
  }

  return "info";
}

function normalizeParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
