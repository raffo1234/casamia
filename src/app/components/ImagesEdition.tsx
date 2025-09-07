"use client";

import { SortableImageEdition } from "./SortableImageEdition";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";
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

export default function ImagesEdition({
  parentColumnValue,
  table,
  parentColumnKey,
  buildHref,
}: {
  parentColumnValue: string;
  table: string;
  parentColumnKey: string;
  buildHref: (index: number) => string;
}) {
  const { data: images, mutate } = useSWR<ImageRow[]>(
    [table, parentColumnValue],
    async () => {
      const { data, error } = await supabase
        .from(table)
        .select("id, image_url, sort_order")
        .eq(parentColumnKey, parentColumnValue)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  );

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

    mutate(optimistic, false);

    const result = await updateImageOrder(
      table,
      parentColumnKey,
      parentColumnValue,
      optimistic.map(({ id }) => ({ id }))
    );

    if (result.success) {
      toast.success(result.message);
      await mutate();
    } else {
      toast.error(result.message);
      await mutate();
    }
  };

  if (!images) {
    return (
      <section
        className="grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
      >
        <div className="h-40 rounded-xl bg-gray-100 animate-pulse" />
        <div className="h-40 rounded-xl bg-gray-100 animate-pulse" />
        <div className="h-40 rounded-xl bg-gray-100 animate-pulse" />
      </section>
    );
  }

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
          <section
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
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
          </section>
        </SortableContext>
      </DndContext>
    </>
  );
}
