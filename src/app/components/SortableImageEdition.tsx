import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ImageEdition from "./ImageEdition";

interface ImageEditionProps {
  parentColumnValue: string;
  table: string;
  openModal: () => void;
  isCover?: boolean;
}

interface SortableImageEditionProps extends ImageEditionProps {
  image: {
    id: string;
    image_url: string;
    sort_order: number;
  };
}

export function SortableImageEdition({
  image,
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
      <ImageEdition image={image} dragHandleProps={listeners} {...props} />
    </div>
  );
}
