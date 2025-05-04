import { Context } from "hono";
import { z } from 'zod';
import { getAnswer } from "../../service/answer/answer.service";
import { extractTokenFromHeader, verifyJwtToken } from "../../utils/jwt";

export const getAnswerController = async (c: Context) => {
    const token = extractTokenFromHeader(c); 

    if (!token) {
      return c.json({ error: 'Unauthorized access. Please provide a valid token.' }, 401);
    }
  let result = verifyJwtToken(token, false);
  if (!result.success) {
    result = verifyJwtToken(token, true);
    
    if (!result.success) {
      return c.json({ error: result.message || 'Unauthorized access. Please provide a valid refresh token.' }, 401);
    }
  }

  const body = await c.req.json();
  const schema = z.object({
    numbers: z.array(z.number()).length(4),
  });

  const validation = schema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: validation.error }, 400);
  }

  const numbers = validation.data.numbers;
  const answers = await getAnswer(numbers);

  return c.json({ answers });
};
