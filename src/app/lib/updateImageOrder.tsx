import { supabase } from "@/lib/supabase";

export async function updateImageOrder(
  table: string,
  parentColumnKey: string,
  parentColumnValue: string,
  images: { id: string }[]
): Promise<{ success: boolean; message: string }> {
  try {
    const updates = images.map(({ id }, index) =>
      supabase
        .from(table)
        .update({ sort_order: index })
        .eq("id", id)
        .eq(parentColumnKey, parentColumnValue)
    );

    const results = await Promise.all(updates);

    const errors = results.filter((r) => r.error);
    if (errors.length > 0) {
      console.error("❌ Errors:", errors);
      return {
        success: false,
        message: "Error al guardar el orden de las imágenes.",
      };
    }

    return {
      success: true,
      message: "¡Orden de imágenes guardado correctamente!",
    };
  } catch (err) {
    console.error("❌ updateImageOrder failed:", err);
    return {
      success: false,
      message: "Error inesperado al guardar el orden de las imágenes.",
    };
  }
}
