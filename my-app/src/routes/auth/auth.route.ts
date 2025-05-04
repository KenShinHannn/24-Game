import { Hono } from "hono";
import { signup, signin, signout } from "../../controller/auth/auth.controller";

const authRoute = new Hono();

authRoute.post("/signup", signup);
authRoute.post("/signin", signin);
authRoute.post("/signout", signout);

export default authRoute;
