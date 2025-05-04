import { Context } from "hono";
import { createUser, validateUser } from "../../service/auth/auth.service";
import { generateJwtToken } from "../../utils/jwt";
import { CreateUserDTO, SignInDTO } from "../../dto/auth/auth.dto";

export const signup = async (c: Context) => {
  const body = await c.req.json();

  const validation = CreateUserDTO.safeParse(body);
  
  if (!validation.success) {
    const errors = validation.error.errors.map(err => err.message).join(", ");
    return c.json({ error: errors }, 400);
  }

  const { username, password } = validation.data;
  await createUser(username, password);
  return c.json({ message: "You have been signed up" });
};

export const signin = async (c: Context) => {
  const body = await c.req.json();

  const validation = SignInDTO.safeParse(body);
  
  if (!validation.success) {
    const errors = validation.error.errors.map(err => err.message).join(", ");
    return c.json({ error: errors }, 400);
  }

  const { username, password } = validation.data;
  const user = await validateUser(username, password);

  if (!user) {
    return c.json({ message: "Invalid credentials" }, 401);
  }

  const accessToken = generateJwtToken(user.user_id, user.username, false);
  const refreshToken = generateJwtToken(user.user_id, user.username, true);

  return c.json({ accessToken, refreshToken });
};

export const signout = async (c: Context) => {
  return c.json({ message: "You have been signed out" });
};