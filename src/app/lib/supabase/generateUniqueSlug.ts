import slugify from "slugify";
import { supabase } from "../supabase";

export const generateUniqueSlug = async (
  title: string,
  currentId?: number,
  currentSlug?: string
) => {
  // If a slug already exists, return it immediately without verification or generation.
  // This is a simple and quick check to prevent unnecessary work.
  if (currentSlug) {
    return currentSlug;
  }

  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    locale: "es",
  });

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    let query = supabase.from("property").select("slug").eq("slug", slug);

    if (currentId) {
      query = query.neq("id", currentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error checking slug:", error);
      throw error;
    }

    if (data.length === 0) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};
