import { httpClient } from "../../../shared/api/httpClient";
import { ApiResponse } from "../../../shared/types/api";
import {
  CreateTaskPayload,
  GetTasksParams,
  Task,
  TaskStatus,
  UpdateTaskPayload
} from "../types/task.types";

export function getTasks(
  params: GetTasksParams = {}
): Promise<ApiResponse<Task[]>> {
  return httpClient<ApiResponse<Task[]>>("/tasks", {
    query: params
  });
}

export function getTaskById(id: string): Promise<ApiResponse<Task>> {
  return httpClient<ApiResponse<Task>>(`/tasks/${id}`);
}

export function createTask(
  payload: CreateTaskPayload
): Promise<ApiResponse<Task>> {
  return httpClient<ApiResponse<Task>>("/tasks", {
    method: "POST",
    body: payload
  });
}

export function updateTask(
  id: string,
  payload: UpdateTaskPayload
): Promise<ApiResponse<Task>> {
  return httpClient<ApiResponse<Task>>(`/tasks/${id}`, {
    method: "PUT",
    body: payload
  });
}

export function updateTaskStatus(
  id: string,
  status: TaskStatus
): Promise<ApiResponse<Task>> {
  return httpClient<ApiResponse<Task>>(`/tasks/${id}/status`, {
    method: "PATCH",
    body: {
      status
    }
  });
}

export function deleteTask(id: string): Promise<ApiResponse<null>> {
  return httpClient<ApiResponse<null>>(`/tasks/${id}`, {
    method: "DELETE"
  });
}
