import { pgSchema, serial, text, varchar } from "drizzle-orm/pg-core";

export const customSchema = pgSchema('24_GameDB');

export const answers = customSchema.table(
  "answers",
  {
    answer_id: serial("answer_id").primaryKey().notNull(),
    number: text("number").notNull(),
    results: varchar("results", { length: 255 }).notNull(),
  },
  
);
