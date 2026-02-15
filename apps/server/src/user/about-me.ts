import { auth } from "@repo/auth";
import { db, eq } from "@repo/db";
import { user } from "@repo/db/schema/auth";
import Elysia, { t } from "elysia";

export const aboutMe = new Elysia({ prefix: "/about-me" })
    .macro({
        auth: {
            async resolve({ status, set, request: { headers } }) {
                const session = await auth.api.getSession({
                    headers,
                });
        
                if (!session) {
                    set.status = 401;
                    return {
                        error: "Unauthorized",
                        user: null
                    };
                }
        
                return {
                    user: session.user,
                    session: session.session
                }
            }
        }
    })
    .get("/", async ({ query, set }) => {
        const result = await db.query.user.findFirst({
            where: (user, { eq }) => eq(user.id, query.userId),
            columns: {
                aboutMe: true
            }
        });

        if (result === undefined) {
            set.status = 404;
            return {
                error: "User not found",
                aboutMeText: null
            };
        }

        set.status = 200;
        return {
            aboutMeText: result.aboutMe
        };
    }, {
        query: t.Object({
            userId: t.String(),
        }),
        auth: true,
        response: {
            200: t.Object({
                aboutMeText: t.Nullable(t.String())
            }),
            404: t.Object({
                error: t.String(),
                aboutMeText: t.Null()
            })
        }
    })
    .post("/", async ({ query, body, set }) => {
        const { userId } = query;
        const { aboutMeText } = body;

        try {
            const updatedUser = await db
                .update(user)
                .set({ aboutMe: aboutMeText })
                .where(eq(user.id, userId))
                .returning({ updatedId: user.id });

            if (updatedUser.length === 0) {
                set.status = 404;
                return { error: "User not found" };
            }

            return { success: true, message: "Profile updated successfully" };
        } catch (err: any) {
            set.status = 500;
            return { error: err.message || "Failed to update profile" };
        }
    }, {
        auth: true,
        query: t.Object({
            userId: t.String(),
        }),
        body: t.Object({
            aboutMeText: t.String({
                minLength: 1,
                maxLength: 1000, // Optional constraint to prevent huge payloads
            }),
        }),
        response: {
            200: t.Object({
                success: t.Boolean(),
                message: t.String()
            }),
            404: t.Object({
                error: t.String()
            }),
            500: t.Object({
                error: t.String()
            })
        }
    });