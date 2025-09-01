import { TypologyImageType } from "./TypologyImageType";

export type TypologyType = {
  id: string;
  slug: string;
  name: string;
  description: string;
  size: string;
  currency: string;
  price: string;
  bathroom_count: string;
  bedroom_count: string;
  floor: string;
  stock: string;
  typology_image: TypologyImageType[];
};
