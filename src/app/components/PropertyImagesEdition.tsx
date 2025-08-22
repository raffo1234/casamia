import PropertyImage from "./PropertyImage";

export default function PropertyImagesEdition({
  propertyImages,
  userId,
}: {
  propertyImages: { image_url: string; id: string }[];
  userId: string;
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
        />
      ))}
    </section>
  );
}
