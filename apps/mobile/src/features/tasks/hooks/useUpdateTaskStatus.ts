import {
  QueryKey,
  useMutation,
  useQueryClient,
  UseMutationResult
} from "@tanstack/react-query";
import { ApiResponse } from "../../../shared/types/api";
import { updateTaskStatus } from "../api/tasksApi";
import { taskQueryKeys } from "../constants/taskQueryKeys";
import { Task, TaskStatus } from "../types/task.types";

interface UpdateTaskStatusVariables {
  id: string;
  status: TaskStatus;
}

interface UpdateTaskStatusContext {
  previousDetail?: ApiResponse<Task>;
  previousLists: Array<[QueryKey, ApiResponse<Task[]> | undefined]>;
}

export function useUpdateTaskStatus(): UseMutationResult<
  ApiResponse<Task>,
  Error,
  UpdateTaskStatusVariables,
  UpdateTaskStatusContext
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateTaskStatus(id, status),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: taskQueryKeys.all
      });

      const detailKey = taskQueryKeys.detail(variables.id);
      const previousDetail =
        queryClient.getQueryData<ApiResponse<Task>>(detailKey);
      const previousLists =
        queryClient.getQueriesData<ApiResponse<Task[]>>({
          queryKey: taskQueryKeys.lists()
        });

      if (previousDetail !== undefined) {
        queryClient.setQueryData<ApiResponse<Task>>(detailKey, {
          ...previousDetail,
          data: {
            ...previousDetail.data,
            status: variables.status
          }
        });
      }

      previousLists.forEach(([queryKey, response]) => {
        if (response === undefined) {
          return;
        }

        queryClient.setQueryData<ApiResponse<Task[]>>(queryKey, {
          ...response,
          data: response.data.map((task) =>
            task.id === variables.id
              ? {
                  ...task,
                  status: variables.status
                }
              : task
          )
        });
      });

      return {
        previousDetail,
        previousLists
      };
    },
    onError: (_error, variables, context) => {
      if (context?.previousDetail !== undefined) {
        queryClient.setQueryData(
          taskQueryKeys.detail(variables.id),
          context.previousDetail
        );
      }

      context?.previousLists.forEach(([queryKey, response]) => {
        queryClient.setQueryData(queryKey, response);
      });
    },
    onSuccess: (response, variables) => {
      queryClient.setQueryData(taskQueryKeys.detail(variables.id), response);
    },
    onSettled: (_response, _error, variables) => {
      void queryClient.invalidateQueries({
        queryKey: taskQueryKeys.detail(variables.id)
      });
      void queryClient.invalidateQueries({
        queryKey: taskQueryKeys.lists()
      });
    }
  });
}
