import { z } from "zod";

export const createAnswerDto = z.object({
  number: z.string().min(1),
  results: z.string().min(1),
});

export const updateAnswerDto = z.object({
  number: z.string().optional(),
  results: z.string().optional(),
});

export type CreateAnswerDto = z.infer<typeof createAnswerDto>;
export type UpdateAnswerDto = z.infer<typeof updateAnswerDto>;
