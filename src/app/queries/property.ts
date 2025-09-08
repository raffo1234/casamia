export const propertyQuery = `
  id,
  title,
  slug,
  price,
  currency,
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
  property (
    id,
    slug,
    title,
    price,
    currency,
    user_id,
    property_image (
      id,
      image_url
    ),
    user:user!property_user_id_fkey (
      id,
      name,
      email,
      image_url,
      slug
    ),
    company:company!property_company_id_fkey (
      id,
      name,
      slug,
      image_url
    )
  )
`;
