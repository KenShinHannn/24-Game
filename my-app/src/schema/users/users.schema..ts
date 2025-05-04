import { pgSchema, serial, varchar } from "drizzle-orm/pg-core";

export const customSchema = pgSchema("24_GameDB");

export const users = customSchema.table("users", {
  user_id: serial("user_id").primaryKey().notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
});
