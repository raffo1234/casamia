"use client";

import { supabase } from "@/lib/supabase";
import { mutate } from "swr";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { NumericFormat } from "react-number-format";
import slugify from "slugify";

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
  const { register, reset, handleSubmit, control } = useForm<TypologyInputs>({
    mode: "onBlur",
  });
  async function onSubmit(data: TypologyInputs) {
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
      locale: "es",
    });

    const { error } = await supabase
      .from("typology")
      .insert([{ ...data, property_id: propertyId, slug }])
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="flex flex-col gap-4">
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
          <label htmlFor="size" className="block font-bold mb-2 font-manrope">
            Area
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
            Precio
          </label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <NumericFormat
                type="text"
                id="price"
                required
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                value={field.value}
                onValueChange={(values) => {
                  field.onChange(values.floatValue);
                }}
                inputMode="numeric"
                className="w-full -m-[1px] px-3 py-2.5 focus:z-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500"
              />
            )}
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
