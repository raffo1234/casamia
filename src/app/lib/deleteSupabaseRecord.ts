import { supabase } from "./supabase";

export async function deleteSupabaseRecord(
  id: string,
  table: string = "dicom"
) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  return error;
}
