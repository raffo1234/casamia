import slugify from "slugify";
import { supabase } from "../supabase";

export const generateUniqueSlug = async (
  title: string,
  currentId?: string,
  currentTitle?: string
) => {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    locale: "es",
  });

  if (currentId && currentTitle && title === currentTitle) {
    return null;
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    let query = supabase.from("property").select("slug");

    query = query.or(`slug.eq.${slug},slug.is.null`);

    if (currentId) {
      query = query.neq("id", currentId);
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
