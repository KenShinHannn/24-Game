import { db } from "../../middleware/db/client";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { users } from "../../schema/users/users.schema.";
import { CreateUserDTO, SignInDTO } from "../../dto/auth/auth.dto";

export async function createUser(username: string, password: string) {
  const parsedData = CreateUserDTO.safeParse({ username, password });
  if (!parsedData.success) {
    const errorMessages = parsedData.error.errors.map((err) => err.message).join(", ");
    throw new Error(`Validation failed: ${errorMessages}`);
  }
  
  const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
  if (existingUser) {
    throw new Error("Username is already taken.");
  }
  const hashed = await bcrypt.hash(password, 10);
  return db.insert(users).values({ username, password: hashed }).returning();
}

export async function validateUser(username: string, password: string) {
  const parsedData = SignInDTO.safeParse({ username, password });
  if (!parsedData.success) {
    throw new Error(`Validation failed: ${parsedData.error}`);
  }
  const result = await db.select().from(users).where(eq(users.username, username));
  if (!result.length) return null;
  
  const valid = await bcrypt.compare(password, result[0].password);
  
  return valid ? result[0] : null;
}