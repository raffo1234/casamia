import PropertyItem from "@/components/PropertyItem";
import { PropertyType } from "@/types/propertyType";

export default function Home({
  properties,
  userEmail,
}: {
  properties: PropertyType[] | null;
  userEmail: string | undefined | null;
}) {
  return properties?.map((property) => (
    <PropertyItem key={property.id} userEmail={userEmail} property={property} />
  ));
}
