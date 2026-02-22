import Elysia, { t } from "elysia";
import { auth } from "@repo/auth";

export const UserProfile = new Elysia({ prefix: "/user-profile" })
    .get("/", async ({ request, set }) => {
        try {
            const session = await auth.api.getSession({
                headers: request.headers,
            });

            if (!session) {
                set.status = 401;
                return { error: "Unauthorized" };
            }

            // Return user profile with image
            return {
                success: true,
                user: {
                    id: session.user.id,
                    name: session.user.name,
                    email: session.user.email,
                    image: session.user.image,
                    createdAt: session.user.createdAt,
                },
            };
        } catch (error) {
            console.error("Error fetching user profile:", error);
            set.status = 500;
            return { error: "Failed to fetch user profile" };
        }
    });
