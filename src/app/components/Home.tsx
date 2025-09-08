import PropertyCard from "@/components/PropertyCard";
import { PropertyType } from "@/types/propertyType";

export default function Home({
  properties,
  userEmail,
}: {
  properties: PropertyType[] | null;
  userEmail: string | undefined | null;
}) {
  return properties?.map((property) => (
    <PropertyCard key={property.id} userEmail={userEmail} property={property} />
  ));
}
