export type PropertyType = {
  id: string;
  title: string;
  user_id: string;
  property_image: {
    id: string;
    image_url: string;
  }[];
  user: {
    id: string;
    name: string;
    email: string;
    image_url: string;
  };
  company: {
    id: string;
    name: string;
    logo_url: string;
  };
};
