import slugify from "slugify";
import { supabase } from "../supabase";

export const generateUniqueSlug = async (
  table: string,
  title: string,
  id?: string | null
) => {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    locale: "es",
  });

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    let query = supabase.from(table).select("slug").eq("slug", slug);

    if (id) {
      query = query.neq("id", id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error checking for duplicate slug:", error);
      throw error;
    }

    if (data.length === 0) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};
