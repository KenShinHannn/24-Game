import { eq } from "drizzle-orm";
import { CreateAnswerDto, UpdateAnswerDto } from "../../dto/answer/answer.dto";
import { db } from "../../middleware/db/client";
import { answers } from "../../schema/answer/answer.schema";

function permuteAll(nums: number[]): number[][] {
  if (nums.length === 1) return [nums];
  const result: number[][] = [];

  for (let i = 0; i < nums.length; i++) {
    const current = nums[i];
    const remaining = nums.slice(0, i).concat(nums.slice(i + 1));
    for (const sub of permuteAll(remaining)) {
      result.push([current, ...sub]);
    }
  }

  return result;
}

export const solveAnswer24Game = async (
  number: number[]
): Promise<string[]> => {
  const result = new Set<string>();
  const operators = ["+", "-", "*", "/"];

  function permute(numbs: number[], expressions: string[]) {
    if (numbs.length === 1) {
      try {
        if (Math.abs(eval(expressions[0]) - 24) < 1e-6) {
          result.add(expressions[0]);
        }
      } catch (e) {
        console.error("Error evaluating expression: ", expressions[0], e);
        throw e;
      }
    }

    for (let i = 0; i < numbs.length; i++) {
      for (let j = 0; j < numbs.length; j++) {
        if (i === j) continue;
        const restNums = numbs.filter((_, index) => index !== i && index !== j);
        const restExpressions = expressions.filter(
          (_, index) => index !== i && index !== j
        );

        for (const op of operators) {
          const a = numbs[i];
          const b = numbs[j];
          const expressionA = expressions[i];
          const expressionB = expressions[j];

          let newNum: number;
          try {
            newNum = eval(`${a}${op}${b}`);
          } catch (e) {
            console.error("Error evaluating operation: ", `${a}${op}${b}`, e);
            continue;
          }

          const newExpression = `(${expressionA}${op}${expressionB})`;
          permute([...restNums, newNum], [...restExpressions, newExpression]);
        }
      }
    }
  }

  const permutations = permuteAll(number);

  for (const perm of permutations) {
    const expressions = perm.map((num) => num.toString());
    permute(perm, expressions);
  }

  return Array.from(result);
};

export const getAnswer = async (numbers: number[]) => {
  const key = numbers
    .slice()
    .sort((a, b) => a - b)
    .join(",");

  const cachedAnswer = await db
    .select()
    .from(answers)
    .where(eq(answers.number, key));

  if (cachedAnswer.length > 0) {
    return cachedAnswer.map((r) => r.results);
  }

  const solution = solveAnswer24Game(numbers);
  const values = (await solution).map((s) => ({ number: key, results: s }));

  if (values.length > 0) {
    await createAnswer(values);
  }

  return solution;
};

export const createAnswer = async (data: CreateAnswerDto[]) => {
  const result = await db.insert(answers).values(data).returning();
  return result;
};
