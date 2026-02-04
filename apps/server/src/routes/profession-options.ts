import { db } from "@repo/db";
import { professionOptions } from "@repo/db/schema/core-schema";
import Elysia, { t } from "elysia";

export const professionsOptions = new Elysia({ prefix: "/options/professions" })
    .get("/", async () => {
        return db.query.professionOptions.findMany();
    })
    .post("/", async ({ body, set }) => {
        try {
            const [newOption] = await db.insert(professionOptions).values({ name: body.name }).returning();
            set.status = 201;
            return newOption;
        } catch (error: any) {
            if (error.message.includes('unique constraint')) {
                set.status = 409;
                return { error: 'Profession option already exists.' };
            }
            set.status = 500;
            return { error: 'Failed to add profession option. Try again later' };
        }
    },
    {
        body: t.Object({
            name: t.String({ minLength: 1, maxLength: 50}),
        })
    }
)