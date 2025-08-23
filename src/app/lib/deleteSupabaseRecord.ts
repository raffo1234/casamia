import { supabase } from "./supabase";

export async function deleteSupabaseRecord(ids: string[], table: string) {
  const { error } = await supabase.from(table).delete().in("id", ids);
  return error;
}
