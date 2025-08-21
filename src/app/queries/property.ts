export const propertyQuery = `
  id,
  title,
  slug,
  price,
  user_id,
  property_image (
    id,
    image_url
  ),
  user!property_user_id_fkey (
    id,
    name,
    email,
    image_url,
    slug
  ),
  company!property_company_id_fkey (
    id,
    name,
    slug,
    logo_url
  )
`;

export const favoriteQuery = `
  property(
    id,
    slug,
    title,
    user_id,
    property_image (
      id,
      image_url
    ),
    user!property_user_id_fkey (
      id,
      name,
      email,
      image_url,
      slug
    ),
    company!property_company_id_fkey (
      id,
      name,
      slug,
      logo_url
    )
  )
`;
