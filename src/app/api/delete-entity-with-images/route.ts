import { NextResponse } from "next/server";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { getKeyFromUrl } from "@/lib/getKeyFromUrl";
import { deleteSupabaseRecord } from "@/lib/deleteSupabaseRecord";
import { getR2Client } from "@/lib/getR2Client";
import { getFileUrlsFromSupabase } from "@/lib/getFileUrlsFromSupabase";

const r2 = getR2Client();

export async function DELETE(request: Request) {
  const { id, table } = await request.json();

  if (!id || !table) {
    return NextResponse.json(
      { message: "Missing required parameters: id or table." },
      { status: 400 }
    );
  }

  const fileUrls = await getFileUrlsFromSupabase(
    "property_image",
    "property_id",
    id,
    "image_url"
  );

  if (fileUrls instanceof NextResponse) {
    return fileUrls;
  }

  if (fileUrls && fileUrls.length > 0) {
    try {
      const fileKeysToDelete = fileUrls
        .map(getKeyFromUrl)
        .filter((key): key is string => key !== null);

      if (fileKeysToDelete.length > 0) {
        if (!r2) {
          console.warn("Skipping R2 deletion due to missing configuration.");
        } else {
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
        }
      }
    } catch (r2Error) {
      console.error("Cloudflare R2 deletion failed on server:", r2Error);
    }
  }

  const error = await deleteSupabaseRecord(id, table);

  if (error) {
    console.error("Supabase record deletion failed on server:", error);
    return NextResponse.json(
      { message: "Failed to delete record from the database." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Item and associated files (if any) deleted successfully." },
    { status: 200 }
  );
}
