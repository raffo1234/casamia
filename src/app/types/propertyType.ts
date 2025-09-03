import { CompanyType } from "./companyType";
import { TransactionType } from "./TransactionType";
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
  google_map?: string;
  location?: string;
  currency?: string;
  property_image?: {
    id: string;
    image_url: string;
    sort_order: number;
  }[];
  user?: UserType;
  company?: CompanyType;
  typologies?: Typology[];
  transaction_type: TransactionType;
  created_at: string;
};
