import { NextResponse } from "next/server";
import { supabase } from "./supabase";

export const getFileUrlsFromSupabase = async (
  tableName: string,
  foreignKeyColumn: string,
  id: string,
  column: string
) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select(column)
      .eq(foreignKeyColumn, id);

    if (error) {
      console.error(`Supabase query failed for table ${tableName}:`, error);
      return NextResponse.json(
        { message: `Failed to retrieve URLs from the ${tableName} table.` },
        { status: 500 }
      );
    }

    const fileUrls: string[] = (
      data as unknown as { [key: string]: string }[]
    ).map((item) => item[column]);

    return fileUrls;
  } catch (error) {
    console.error(
      "An unexpected error occurred in getFileUrlsFromSupabase:",
      error
    );
    return NextResponse.json(
      { message: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
};
