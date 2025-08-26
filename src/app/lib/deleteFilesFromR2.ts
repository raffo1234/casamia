import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { getKeyFromUrl } from "@/lib/getKeyFromUrl";
import { getR2Client } from "@/lib/getR2Client";

const r2 = getR2Client();

export async function deleteFilesFromR2(fileUrls: string[]) {
  if (!fileUrls || fileUrls.length === 0) return;

  try {
    const fileKeysToDelete = fileUrls
      .map(getKeyFromUrl)
      .filter((key): key is string => key !== null);

    if (fileKeysToDelete.length === 0) return;

    if (!r2) {
      console.warn("Skipping R2 deletion due to missing configuration.");
      return;
    }

    const deleteParams = {
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Delete: {
        Objects: fileKeysToDelete.map((key) => ({ Key: key })),
        Quiet: true,
      },
    };

    const deleteCommand = new DeleteObjectsCommand(deleteParams);
    await r2.send(deleteCommand);

    console.warn(
      `Successfully deleted ${fileKeysToDelete.length} files from R2.`
    );
  } catch (r2Error) {
    console.error("Cloudflare R2 deletion failed on server:", r2Error);
  }
}
