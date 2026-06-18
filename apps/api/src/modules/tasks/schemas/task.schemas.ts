import { z } from "zod";
import { taskStatuses } from "@/modules/tasks/types/task.types";

const optionalTextSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value === "" ? undefined : value));

const dueDateSchema = z
  .string()
  .datetime()
  .optional()
  .transform((value) => (value === undefined ? undefined : new Date(value)));

const teamIdsSchema = z.array(z.string().trim().min(1)).optional();

const numericQueryParamSchema = z
  .union([z.string(), z.number()])
  .optional()
  .transform((value) => {
    if (value === undefined || value === "") {
      return undefined;
    }

    return Number(value);
  });

const taskSortSchema = z.enum([
  "createdAt:desc",
  "createdAt:asc",
  "dueDate:asc",
  "dueDate:desc",
  "title:asc",
  "title:desc"
]);

export const taskIdParamSchema = z.object({
  id: z.string().trim().min(1)
});

export const listTasksQuerySchema = z.object({
  teamId: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  status: z
    .union([z.enum(taskStatuses), z.literal("")])
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  search: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  limit: numericQueryParamSchema
    .pipe(z.number().int().min(1).max(100).optional())
    .default(10),
  offset: numericQueryParamSchema
    .pipe(z.number().int().min(0).optional())
    .default(0),
  sort: taskSortSchema.default("createdAt:desc")
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(3),
  description: optionalTextSchema,
  status: z.enum(taskStatuses).optional(),
  dueDate: dueDateSchema,
  teamIds: teamIdsSchema
});

export const updateTaskSchema = createTaskSchema.partial().refine(
  (data) =>
    data.title !== undefined ||
    data.description !== undefined ||
    data.status !== undefined ||
    data.dueDate !== undefined ||
    data.teamIds !== undefined,
  {
    message: "At least one field must be provided"
  }
);

export const updateTaskStatusSchema = z.object({
  status: z.enum(taskStatuses)
});

export type TaskIdParams = z.infer<typeof taskIdParamSchema>;
export type ListTasksQuerySchema = z.infer<typeof listTasksQuerySchema>;
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusSchema = z.infer<typeof updateTaskStatusSchema>;
