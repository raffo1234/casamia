import { NextResponse } from "next/server";
import { supabase } from "./supabase";

export const getFileUrlsFromSupabase = async (
  tableName: string,
  foreignKeyColumn: string,
  ids: string[],
  column: string
) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select(column)
      .in(foreignKeyColumn, ids);

    if (error) {
      console.error(`Supabase query failed for table ${tableName}:`, error);
      return NextResponse.json(
        { message: `Failed to retrieve URLs from the ${tableName} table.` },
        { status: 500 }
      );
    }

    const fileUrls: string[] = (data as unknown as { [key: string]: string }[])
      .map((item) => item[column])
      .filter((url): url is string => Boolean(url));

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
