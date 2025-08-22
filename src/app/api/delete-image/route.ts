import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getKeyFromUrl } from "@/lib/getKeyFromUrl";
import { getR2Client } from "@/lib/getR2Client";
import { supabase } from "@/lib/supabase";

const r2 = getR2Client();

export async function DELETE(request: Request) {
  const { id, table } = await request.json();

  if (!id || !table) {
    return NextResponse.json(
      { message: "Missing required parameter: id." },
      { status: 400 }
    );
  }

  try {
    const { data, error: selectError } = (await supabase
      .from(table)
      .select("image_url")
      .eq("id", id)
      .single()) as { data: { image_url: string } | null; error: Error };

    if (selectError) {
      console.error("Supabase image query failed:", selectError);
      return NextResponse.json(
        { message: "Failed to retrieve image URL from the database." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { message: "Image record not found." },
        { status: 404 }
      );
    }

    const imageUrl = data.image_url;
    const imageKey = getKeyFromUrl(imageUrl);

    if (r2 && imageKey) {
      const deleteParams = {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
        Key: imageKey,
      };
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await r2.send(deleteCommand);
      console.warn(`Successfully deleted file from R2: ${imageKey}`);
    } else {
      console.warn("Skipping R2 deletion. R2 not configured or invalid key.");
    }

    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase record deletion failed:", deleteError);
      return NextResponse.json(
        { message: "Failed to delete record from the database." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Image and associated record deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("An error occurred during the deletion process:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred during deletion." },
      { status: 500 }
    );
  }
}
