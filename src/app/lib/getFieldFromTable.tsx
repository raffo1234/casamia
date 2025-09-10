"use client";

import { supabase } from "@/lib/supabase";

export async function getFieldFromTable<T>(
  tableName: string,
  columnKey: string,
  columnValue: string,
  columnName: string
): Promise<T | null> {
  const { data, error } = await supabase
    .from(tableName)
    .select(columnName)
    .eq(columnKey, columnValue)
    .single();

  if (error) {
    console.error(
      `Error fetching column '${columnName}' from table '${tableName}' for ID ${id}:`,
      error
    );
    return null;
  }

  const resultObject = data as unknown as Record<string, T> | null;

  if (resultObject && resultObject[columnName] !== undefined) {
    return resultObject[columnName];
  }

  return null;
}
