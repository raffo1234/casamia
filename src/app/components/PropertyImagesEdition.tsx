import PropertyImage from "./PropertyImage";

export default function PropertyImagesEdition({
  propertyImages,
  userId,
  mutateProperty,
}: {
  propertyImages: { image_url: string; id: string }[];
  userId: string;
  mutateProperty: () => void;
}) {
  return (
    <section
      className="grid gap-6"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {propertyImages?.map((propertyImage) => (
        <PropertyImage
          userId={userId}
          key={propertyImage.id}
          propertyImage={propertyImage}
          mutateProperty={mutateProperty}
        />
      ))}
    </section>
  );
}
