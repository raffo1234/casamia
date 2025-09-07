import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ImageEdition from "./ImageEdition";

interface ImageEditionProps {
  parentColumnValue: string;
  table: string;
  isCover?: boolean;
  buildHref: (index: number) => string;
}

interface SortableImageEditionProps extends ImageEditionProps {
  image: {
    id: string;
    image_url: string;
    sort_order: number;
  };
  imageIndex: number;
}

export function SortableImageEdition({
  image,
  imageIndex,
  buildHref,
  ...props
}: SortableImageEditionProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ImageEdition
        image={image}
        href={buildHref(imageIndex)}
        dragHandleProps={listeners}
        {...props}
      />
    </div>
  );
}
