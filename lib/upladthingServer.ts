"use server";

import { utapi } from "@/app/api/uploadthing/core";

export async function deleteFile(url: string) {
  // fileUrl example https://utfs.io/f/2b281f48-05f6-4c49-a385-1b2fb25602cb-1d.png
  const updatedUrl = url.replace("https://utfs.io/f/", "");
  return await utapi.deleteFiles(updatedUrl);
}
