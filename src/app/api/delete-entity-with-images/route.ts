import { NextResponse } from "next/server";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { getKeyFromUrl } from "@/lib/getKeyFromUrl";
import { deleteSupabaseRecord } from "@/lib/deleteSupabaseRecord";
import { getR2Client } from "@/lib/getR2Client";
import { getFileUrlsFromSupabase } from "@/lib/getFileUrlsFromSupabase";

const r2 = getR2Client();

export async function DELETE(request: Request) {
  const { ids, table, imageTable, foreignKey, imageColumn } =
    await request.json();

  if (!ids || ids.length === 0 || !table) {
    return NextResponse.json(
      { message: "Missing required parameters: ids or table." },
      { status: 400 }
    );
  }

  try {
    const fileUrls = await getFileUrlsFromSupabase(
      imageTable,
      foreignKey,
      ids,
      imageColumn
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

    
    const error = await deleteSupabaseRecord(ids, table);

    if (error) {
      console.error("Supabase record deletion failed on server:", error);
      return NextResponse.json(
        { message: "Failed to delete records from the database." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Items and associated files (if any) deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error during deletion:", error);
    return NextResponse.json(
      { message: "Internal server error during deletion." },
      { status: 500 }
    );
  }
}
