"use client";

import { supabase } from "@/lib/supabase";
import { mutate } from "swr";
import { useForm } from "react-hook-form";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type TypologyInputs = {
  name: string;
  size: string;
  price: string;
  property_id: string;
  bedroom_count: string;
};

export default function InsertPropertyTypology({
  propertyId,
}: {
  propertyId: string;
}) {
  const router = useRouter();
  const { register, reset, handleSubmit } = useForm<TypologyInputs>({
    mode: "onBlur",
  });
  async function insertData(data: TypologyInputs) {
    const { error } = await supabase
      .from("typology")
      .insert([{ ...data, property_id: propertyId }])
      .select()
      .single();

    await mutate(`${propertyId}-typologies`);
    toast.success("Added successfully");
    reset();
    router.push(`/admin/property/edit/${propertyId}/typologies`);

    if (error) {
      console.error("Error inserting data:", error);
      return { success: false, error: error?.message };
    }
  }

  return (
    <form onSubmit={handleSubmit(insertData)}>
      <fieldset className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block font-bold mb-2 font-manrope">
            Name
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
          <label htmlFor="size" className="block font-bold mb-2 font-manrope">
            Size
          </label>
          <input
            type="number"
            id="size"
            {...register("size")}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="bedroom_count"
            className="block font-bold mb-2 font-manrope"
          >
            Dormitorios
          </label>
          <input
            type="number"
            id="bedroom_count"
            {...register("bedroom_count")}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="price" className="block font-bold mb-2 font-manrope">
            Price
          </label>
          <input
            type="text"
            id="price"
            {...register("price")}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <footer className="flex items-center gap-2 pt-4 mt-4 justify-end">
          <Link href={`/admin/property/edit/${propertyId}/typologies`}>
            Cancelar
          </Link>
          <button type="submit">Guardar</button>
        </footer>
      </fieldset>
    </form>
  );
}
