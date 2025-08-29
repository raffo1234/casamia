import { CompanyType } from "./companyType";
import { UserType } from "./userType";

type Typology = {
  name: string;
  description: string;
  price: string;
  size: string;
  stock: string;
  bathroom_count: string;
  bedroom_count: string;
};

export type PropertyType = {
  id: string;
  slug: string;
  title: string;
  user_id: string;
  bathroom_count?: string;
  bedroom_count?: string;
  description?: string;
  phase?: string;
  delivery_at?: Date | number | string;
  price?: string;
  location?: string;
  currency?: string;
  property_image?: {
    id: string;
    image_url: string;
  }[];
  user?: UserType;
  company?: CompanyType;
  typologies?: Typology[];
};
