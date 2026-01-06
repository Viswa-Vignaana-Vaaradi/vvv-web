import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter: FileRouter = {
    
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;