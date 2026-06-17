import { z } from "zod";

const numericQueryParamSchema = z
  .union([z.string(), z.number()])
  .optional()
  .transform((value) => {
    if (value === undefined || value === "") {
      return undefined;
    }

    return Number(value);
  });

const descriptionSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value === "" ? undefined : value));

export const teamIdParamSchema = z.object({
  id: z.string().trim().min(1)
});

export const listTeamsQuerySchema = z.object({
  limit: numericQueryParamSchema
    .pipe(z.number().int().min(1).max(100).optional())
    .default(20),
  offset: numericQueryParamSchema
    .pipe(z.number().int().min(0).optional())
    .default(0),
  search: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === "" ? undefined : value))
});

export const createTeamSchema = z.object({
  name: z.string().trim().min(2),
  colorHex: z.string().trim().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
  description: descriptionSchema
});

export const updateTeamSchema = createTeamSchema.partial().refine(
  (data) =>
    data.name !== undefined ||
    data.colorHex !== undefined ||
    data.description !== undefined,
  {
    message: "At least one field must be provided"
  }
);

export type TeamIdParams = z.infer<typeof teamIdParamSchema>;
export type ListTeamsQuerySchema = z.infer<typeof listTeamsQuerySchema>;
export type CreateTeamSchema = z.infer<typeof createTeamSchema>;
export type UpdateTeamSchema = z.infer<typeof updateTeamSchema>;
