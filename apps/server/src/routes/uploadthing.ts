import { Elysia } from "elysia";
import { createRouteHandler } from "uploadthing/server";



export const uploadThingRoutes = new Elysia({ prefix: "/api/uploadthing" })
//   .all("/uploadthing", async (ctx) => {
//     const handler = createRouteHandler({
//       router: uploadRouter,
//     });
    
//     try {
//       const response = await handler(ctx.request);
//       console.log("UploadThing POST handler response:", response);
//       return response;
//     } catch (error) {
//       console.error("UploadThing POST handler error:", error);
//       return new Response(JSON.stringify({ error: "Upload failed" }), {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//   })

    