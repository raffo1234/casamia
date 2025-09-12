"use client";

import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { Icon } from "@iconify/react";
import DeletePropertyType from "./DeletePropertyType";
import Link from "next/link";
import EditLink from "./EditButton";
import FirstImage from "./FirstImage";
import PropertiesAdminGrid from "./PropertiesAdminGrid";
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { arrayMove } from "@dnd-kit/sortable";
import toast from "react-hot-toast";

interface TypologyDragAndDropType {
  id: string;
  name: string;
  sort_order: number | null;
  typology_image: Array<{ id: string; image_url: string }>;
}

const fetcherType = async (propertyId: string) => {
  const { data, error } = await supabase
    .from("typology")
    .select(
      `
      id,
      name,
      sort_order,
      typology_image(id, image_url)
    `,
    )
    .eq("property_id", propertyId)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return data as TypologyDragAndDropType[];
};

function SortableItem({ children, id }: { children: React.ReactNode; id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {children}
      <button
        className="cursor-grab absolute p-2 w-11 h-11 flex transition-colors duration-300 items-center justify-center top-1 right-1 rounded-full bg-white hover:bg-slate-100"
        {...listeners}
        {...attributes}
      >
        <Icon icon="fluent:drag-24-regular" fontSize={28}></Icon>
      </button>
    </div>
  );
}

const updateSortOrder = async (typologies: TypologyDragAndDropType[]) => {
  const updates = typologies.map((typology, index) =>
    supabase.from("typology").update({ sort_order: index }).eq("id", typology.id),
  );

  const results = await Promise.all(updates);

  const hasErrors = results.some((result) => result.error);

  
  if (hasErrors) {
    toast.error("Error al actualizar el orden de las tipologías. Intente nuevamente.");
    
    for (const { error } of results) {
      if (error) {
        console.error("Error updating sort order:", error);
      }
    }
  } else {
    toast.success("Orden de Tipologías guardado correctamente!");
  }
};

export default function PropertyTypologies({ propertyId }: { propertyId: string }) {
  const { data: types = [], isLoading } = useSWR(`${propertyId}-typology-with-images`, () =>
    fetcherType(propertyId),
  );

  const [items, setItems] = useState<TypologyDragAndDropType[]>([]);

  useEffect(() => {
    if (types.length > 0) {
      setItems(types);
    }
  }, [types]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id === over?.id) {
      return;
    }

    setItems((prevItems) => {
      const oldIndex = prevItems.findIndex((item) => item.id === active.id);
      const newIndex = prevItems.findIndex((item) => item.id === over?.id);
      return arrayMove(prevItems, oldIndex, newIndex);
    });

    const updatedItems = arrayMove(
      items,
      items.findIndex((item) => item.id === active.id),
      items.findIndex((item) => item.id === over?.id),
    );
    updateSortOrder(updatedItems);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {isLoading ? (
        <PropertiesAdminGrid>
          <div className="h-[260px] bg-slate-100 animate-pulse rounded-3xl "></div>
          <div className="h-[260px] bg-slate-100 animate-pulse rounded-3xl "></div>
          <div className="h-[260px] bg-slate-100 animate-pulse rounded-3xl "></div>
        </PropertiesAdminGrid>
      ) : (
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {items.map((typology) => (
              <SortableItem key={typology.id} id={typology.id}>
                <div className="rounded-3xl overflow-hidden">
                  <Link
                    href={`/admin/property/edit/${propertyId}/typologies/edit/${typology.id}/images`}
                  >
                    <FirstImage src={typology.typology_image[0]?.image_url} title={typology.name} />
                  </Link>
                  <div className="bg-white border-x px-4 border-b py-5 border-slate-100">
                    <h2 className="mb-5 text-xl line-clamp-1">
                      <p>{typology.name}</p>
                    </h2>
                    <div className="flex gap-2 item-center w-full justify-center">
                      <EditLink
                        href={`/admin/property/edit/${propertyId}/typologies/edit/${typology.id}`}
                      />
                      <DeletePropertyType propertyId={propertyId} id={typology.id} />
                    </div>
                  </div>
                </div>
              </SortableItem>
            ))}
            <Link
              href={`/admin/property/edit/${propertyId}/typologies/add`}
              className="hover:bg-gray-200 min-h-30 transition-colors active:bg-gray-300 h-[260px] bg-gray-100 rounded-3xl flex justify-center items-center"
            >
              <Icon icon="material-symbols-light:add-2-rounded" className="text-3xl" />
            </Link>
          </div>
        </SortableContext>
      )}
    </DndContext>
  );
}
