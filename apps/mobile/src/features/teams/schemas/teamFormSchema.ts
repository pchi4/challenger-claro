import { z } from "zod";

export const teamFormSchema = z.object({
  name: z.string().min(2, "Informe pelo menos 2 caracteres."),
  colorHex: z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Informe uma cor hexadecimal válida."),
  description: z.string().optional()
});

export type TeamFormValues = z.infer<typeof teamFormSchema>;
