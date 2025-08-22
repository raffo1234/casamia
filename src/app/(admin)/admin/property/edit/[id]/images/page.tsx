import EditPropertyImages from "@/components/EditPropertyImages";

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;

  return <EditPropertyImages propertyId={id} />;
}
