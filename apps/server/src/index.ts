import { cors } from "@elysiajs/cors";
import { node } from "@elysiajs/node";
import { auth } from "@repo/auth";
import { env } from "@repo/env/server";
import { Elysia } from "elysia";
import { professionsOptions } from "./routes/profession-options";

export default new Elysia({ adapter: node() })
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  .all("/api/auth/*", async (context) => {
    const { request, status } = context;
    if (["POST", "GET"].includes(request.method)) {
      console.log(`Handling ${request.method} request for ${request.url}`);
      return auth.handler(request);
    }
    return status(405);
  })
  .get("/", () => "OK")
  .mount(auth.handler)
  .use(professionsOptions)
  
  .listen(5050, () => {
    console.log("Server is running on http://localhost:5050");
  });

