import InsertPropertyType from "@/components/InsertPropertyTypology";
import Title from "@/components/Title";

type Params = Promise<{ id: string }>;

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <>
      <Title>Add Typology</Title>
      <InsertPropertyType propertyId={id} />
    </>
  );
}
