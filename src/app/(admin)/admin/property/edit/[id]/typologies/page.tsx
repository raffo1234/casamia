import PropertyTypologies from "@/components/PropertyTypologies";

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;

  return <PropertyTypologies propertyId={id} />;
}
