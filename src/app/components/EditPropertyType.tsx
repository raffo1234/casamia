"use client";

import { useEffect, useMemo } from "react";
import useSWR, { mutate } from "swr";
import { supabase } from "@/lib/supabase";
import { useForm, type SubmitHandler } from "react-hook-form";
import FormSkeleton from "./FormSkeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Title from "./Title";

type Inputs = {
  size: string;
  price: string;
  name: string;
  description: string;
  bathroom_count: number;
  bed_count: number;
  stock: string;
  floor: string;
};

async function fetcher(typologyId: string) {
  const { data, error } = await supabase
    .from("typology")
    .select()
    .eq("id", typologyId)
    .single();
  if (error) throw error;
  return data;
}

export default function EditPropertyType({
  propertyId,
  typologyId,
}: {
  propertyId: string;
  typologyId: string;
}) {
  const router = useRouter();
  const {
    data: typology,
    error,
    isLoading,
  } = useSWR(typologyId, () => fetcher(typologyId));

  const { reset, register, handleSubmit } = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: useMemo(() => {
      return typology;
    }, [typology]),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const { data: updatedData } = await supabase
        .from("typology")
        .update(data)
        .eq("id", typologyId)
        .select()
        .single();

      await mutate(typologyId, updatedData);
      toast.success("Updated successfully");
      router.push(`/admin/property/edit/${propertyId}/typologies`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    reset(typology);
  }, [typology, reset]);

  if (error) return <div>Error loading item details</div>;

  return isLoading ? (
    <FormSkeleton rows={2} />
  ) : (
    <>
      <Title>Editar Tipologia</Title>
      <form onSubmit={handleSubmit(onSubmit)} id="editProperty">
        <fieldset className="flex flex-col gap-4">
          <div>
            <span className="mb-2 font-bold font-manrope">Creado: </span>
            <span>
              {format(new Date(typology.created_at), "dd MMMM, yyyy", {
                locale: es,
              })}
            </span>
          </div>
          <div>
            <label htmlFor="name" className="block font-bold mb-2 font-manrope">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block font-bold mb-2 font-manrope"
            >
              Descripcion
            </label>
            <textarea
              id="description"
              {...register("description")}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <footer className="flex items-center gap-2 pt-4 mt-4 justify-end">
            <Link href={`/admin/property/edit/${propertyId}/typologies`}>
              Cancel
            </Link>
            <button type="submit">Guardar</button>
          </footer>
        </fieldset>
      </form>
    </>
  );
}
