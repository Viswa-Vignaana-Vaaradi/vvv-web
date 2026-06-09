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
    .onUploadComplete(async ({ file, metadata }) => {
        try {
            console.log("Upload complete:", { fileKey: file.key, fileUrl: file.url, metadata });
            
            const result = await auth.api.updateUser({
                body: {
                    image: file.ufsUrl,
                },
            });
            
            console.log("User updated with image:", result);
            return { success: true, fileUrl: file.url };
        } catch (error) {
            console.error("Error updating user with image:", error);
            throw new UploadThingError("Failed to update user profile");
        }
    })
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;