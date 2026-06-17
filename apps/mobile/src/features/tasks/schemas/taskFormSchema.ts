import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().trim().min(3, "Informe ao menos 3 caracteres."),
  description: z.string().trim().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "DONE"], {
    required_error: "Selecione um status."
  }),
  dueDate: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        value.length === 0 ||
        !Number.isNaN(Date.parse(value)),
      "Informe uma data válida."
    ),
  teamIds: z.array(z.string()).optional()
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
