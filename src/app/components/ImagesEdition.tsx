import ImageEdition from "./ImageEdition";

export default function ImagesEdition({
  images,
  parentColumnValue,
  table
}: {
  images: { image_url: string; id: string }[];
  parentColumnValue: string;
  table: string;
}) {
  return (
    <section
      className="grid gap-6"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {images?.map((image) => (
        <ImageEdition
          key={image.id}
          image={image}
          parentColumnValue={parentColumnValue}
          table={table}
        />
      ))}
    </section>
  );
}
