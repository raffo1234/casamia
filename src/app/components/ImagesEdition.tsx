"use client";

import { SortableImageEdition } from "./SortableImageEdition";
import { mutate } from "swr";
import toast from "react-hot-toast";

import {
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

type ImageRow = {
  id: string;
  image_url: string;
  sort_order: number;
};

import { updateImageOrder } from "@/lib/updateImageOrder";
import GridAdminImages from "./GridAdminImages";

export default function ImagesEdition({
  parentColumnValue,
  table,
  parentColumnKey,
  buildHref,
  images,
}: {
  parentColumnValue: string;
  table: string;
  parentColumnKey: string;
  buildHref: (index: number) => string;
  images: ImageRow[];
}) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 8 },
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!images || images.length === 0) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const optimistic = arrayMove(images, oldIndex, newIndex).map(
      (img, idx) => ({
        ...img,
        sort_order: idx,
      })
    );

    await mutate([parentColumnValue, "images"], optimistic, false);

    try {
      const result = await updateImageOrder(
        table,
        parentColumnKey,
        parentColumnValue,
        optimistic.map(({ id }) => ({ id }))
      );

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <GridAdminImages>
            {images.map((image, index) => (
              <SortableImageEdition
                key={image.id}
                image={image}
                parentColumnValue={parentColumnValue}
                table={table}
                isCover={index === 0}
                buildHref={buildHref}
                imageIndex={index}
              />
            ))}
          </GridAdminImages>
        </SortableContext>
      </DndContext>
    </>
  );
}
