import { z } from "zod";

export const createAnswerDto = z.object({
  number: z.string().min(1),
  results: z.string().min(1),
});

export type CreateAnswerDto = z.infer<typeof createAnswerDto>;
