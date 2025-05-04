import { Hono } from "hono";
import { getAnswerController } from "../../controller/answer/answer.controller";

const answerRoute = new Hono()

answerRoute.post("/answer", getAnswerController)

export default answerRoute