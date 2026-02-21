import { createUploadthing, UploadThingError, type FileRouter } from "uploadthing/server";
import { auth } from "@repo/auth";

const f = createUploadthing();

export const uploadRouter: FileRouter = {
    profilePicture: f(
        {
            image: {
                maxFileCount: 1,
                minFileCount: 1,
                maxFileSize: "8MB",
                contentDisposition: "inline",
            },
        },
        {
            awaitServerData: true,
        }
    )
    .middleware(async ({ req }) => {
        try {
            let ses = null;

            ses = await auth.api.getSession({
                headers: req.headers,
            });

            if (!ses) throw new Error("Not authenticated");

            return {
                userId: ses.user.id,
            };
        } catch (error) {
            throw new UploadThingError("Internal server error in upload middleware");
        }
    })
    .onUploadComplete(async ({ metadata, file }) => {
        await auth.api.updateUser({
            body: {
                image: file.key,
            }
        })
    })
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;