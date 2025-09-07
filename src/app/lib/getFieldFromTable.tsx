// This file can remain as-is, as it's a generic fetcher function.
// lib/getFieldFromTable.ts
"use client";

import { supabase } from "@/lib/supabase";

export async function getFieldFromTable<T>(
  tableName: string,
  id: string,
  columnName: string
): Promise<T | null> {
  const { data, error } = await supabase
    .from(tableName)
    .select(columnName)
    .eq("id", id)
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
