import { Icon } from "@iconify/react";
import Image from "next/image";
import DeleteButton from "./DeleteButton";

export default function PropertyImagesEdition({
  propertyImages,
}: {
  propertyImages: { image_url: string }[];
}) {
  const onDelete = () => {
    console.log("delete");
  };

  return (
    <div
      className="grid gap-6"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {propertyImages?.map(({ image_url }) => {
        return (
          <div key={image_url}>
            <Image
              key={image_url}
              src={image_url}
              alt="Inmueble"
              className="w-full aspect-[5/4] object-cover rounded-xl bg-gray-100"
              width={400}
              height={300}
            />
            <div className="flex justify-center border-x border-b border-gray-100 -mt-3 pt-6 pb-3 px-4 rounded-b-xl">
              <DeleteButton onClick={onDelete} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
