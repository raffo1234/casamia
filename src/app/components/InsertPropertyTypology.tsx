"use client";

import { supabase } from "@/lib/supabase";
import { mutate } from "swr";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { NumericFormat } from "react-number-format";
import slugify from "slugify";
import FormSection from "./FormSection";
import FormSectionTitle from "./FormSectionTitle";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";
import FormFooter from "./FormFooter";
import { inputClassName } from "@/constants";

type TypologyInputs = {
  name: string;
  size: string;
  price: string;
  property_id: string;
  bedroom_count: string;
};

export default function InsertPropertyTypology({ propertyId }: { propertyId: string }) {
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
      <FormSection>
        <FormSectionTitle>Informaci&oacute;n General</FormSectionTitle>
        <fieldset className="flex flex-col gap-6">
          <div>
            <label htmlFor="name" className="inline-block mb-2 text-sm">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="size" className="inline-block mb-2 text-sm">
              &Aacute;rea m<sup>2</sup>
            </label>
            <input
              type="number"
              id="size"
              {...register("size")}
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="bedroom_count" className="inline-block mb-2 text-sm">
              Dormitorios
            </label>
            <input
              type="number"
              id="bedroom_count"
              {...register("bedroom_count")}
              required
              defaultValue={1}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="price" className="inline-block mb-2 text-sm">
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
                  className={inputClassName}
                />
              )}
            />
          </div>
          <FormFooter>
            <SecondaryButton href={`/admin/property/edit/${propertyId}/typologies`}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton title="Guardar">Guardar</PrimaryButton>
          </FormFooter>
        </fieldset>
      </FormSection>
    </form>
  );
}
