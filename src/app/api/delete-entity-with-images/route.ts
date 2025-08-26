import { NextResponse } from "next/server";
import { deleteSupabaseRecord } from "@/lib/deleteSupabaseRecord";
import { getFileUrlsFromSupabase } from "@/lib/getFileUrlsFromSupabase";
import { deleteFilesFromR2 } from "@/lib/deleteFilesFromR2";

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
      await deleteFilesFromR2(fileUrls);
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
