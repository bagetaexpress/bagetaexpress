import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";

const f = createUploadthing();

export const utapi = new UTApi();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const sesstion = await getServerSession(authOptions);
      if (!sesstion) throw new Error("Unauthorized");
      if (!sesstion.user) throw new Error("Unauthorized");
      const user = sesstion.user;
      // return `metadata`;
      return { userId: user.id };
      // return { userId: "none" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // `onClientUploadComplete` clientSide callback
      return { uploadedBy: metadata.userId, url: file.url, status: 200 };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
