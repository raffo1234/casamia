import EditPropertyType from "@/components/EditPropertyType";

type Params = Promise<{ id: string; typologyId: string }>;

export default async function Page({ params }: { params: Params }) {
  const { typologyId, id } = await params;

  return <EditPropertyType propertyId={id} typologyId={typologyId} />;
}
