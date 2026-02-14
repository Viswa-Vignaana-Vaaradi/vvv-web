import { auth } from "@repo/auth";
import { db } from "@repo/db";
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