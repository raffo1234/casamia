"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import { supabase } from "@/lib/supabase";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import FormSkeleton from "./FormSkeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import FormSection from "./FormSection";
import FormSectionTitle from "./FormSectionTitle";
import FormInputLabel from "./FormInputLabel";
import { NumericFormat } from "react-number-format";
import { CurrencyCode } from "@/enums/currencyCodes";
import { generateUniqueSlug } from "@/lib/supabase/generateUniqueSlug";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import FormFooter from "./FormFooter";
import { inputClassName } from "@/constants";

type Inputs = {
  size: string;
  price: string;
  name: string;
  description: string;
  bathroom_count: number;
  bedroom_count: number;
  stock: string;
  floor: string;
  currency: string;
  typology_image?: {
    image_url: string;
  }[];
};

async function fetcher(typologyId: string) {
  const { data, error } = await supabase.from("typology").select("*").eq("id", typologyId).single();
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
  console.log({ propertyId });
  console.log({ typologyId });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    data: typology,
    error,
    isLoading,
  } = useSWR(`${typologyId}-no-images`, () => fetcher(typologyId));

  const { reset, register, control, handleSubmit } = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: useMemo(() => {
      return typology;
    }, [typology]),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const newSlug = await generateUniqueSlug("typology", data.name, typology.id);

    setIsSubmitting(true);

    try {
      const updatePayload = { ...data, slug: newSlug };

      await supabase.from("typology").update(updatePayload).eq("id", typologyId);

      await mutate(typologyId);
      toast.success("Guardado correctamente!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      redirect(`/admin/property/edit/${propertyId}/typologies`);
    }
  };

  useEffect(() => {
    reset(typology);
  }, [typology, reset]);

  if (error) return <div>Error cargando detalles</div>;

  if (isLoading) return <FormSkeleton rows={2} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="editProperty">
      <div className="flex flex-col gap-6">
        <FormSection>
          <FormSectionTitle>Información General</FormSectionTitle>
          <fieldset>
            <FormInputLabel htmlFor="created_at">Creado</FormInputLabel>
            <input
              type="text"
              disabled
              value={format(new Date(typology.created_at), "dd MMMM, yyyy - hh:MM aaa", {
                locale: es,
              })}
              className={inputClassName}
            />
          </fieldset>
          <fieldset>
            <FormInputLabel htmlFor="name">Nombre</FormInputLabel>
            <input
              type="text"
              id="name"
              {...register("name")}
              required
              className={inputClassName}
            />
          </fieldset>
          <fieldset>
            <FormInputLabel htmlFor="description">Descripcion</FormInputLabel>
            <textarea
              id="description"
              {...register("description")}
              required
              className={inputClassName}
            />
          </fieldset>
        </FormSection>
        <FormSection>
          <FormSectionTitle>Precio</FormSectionTitle>
          <div className="flex gap-5 items-center">
            <div>
              <label className="inline-block mb-2 text-sm">Moneda</label>
              <div className="flex items-center">
                <div className="w-1/2">
                  <input
                    {...register("currency")}
                    value={CurrencyCode.PEN}
                    type="radio"
                    id="currency_soles"
                    className="peer hidden"
                    defaultChecked
                    required
                  />
                  <label
                    htmlFor="currency_soles"
                    className="relative flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-l-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:z-10 peer-checked:bg-cyan-50"
                  >
                    Soles
                  </label>
                </div>
                <div className="w-1/2 -ml-[1px]">
                  <input
                    {...register("currency")}
                    value={CurrencyCode.USD}
                    type="radio"
                    id="currency_dolares"
                    className="peer hidden"
                    required
                  />
                  <label
                    htmlFor="currency_dolares"
                    className="flex relative items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-r-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:z-10 peer-checked:bg-cyan-50"
                  >
                    Dolares
                  </label>
                </div>
              </div>
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
                    className="w-full -m-[1px] px-3 py-2.5 focus:z-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500"
                  />
                )}
              />
            </div>
          </div>
        </FormSection>
        <FormSection>
          <FormSectionTitle>Detalles</FormSectionTitle>
          <fieldset>
            <FormInputLabel htmlFor="size">
              &Aacute;rea m<sup>2</sup>
            </FormInputLabel>
            <input id="size" {...register("size")} required className={inputClassName} />
          </fieldset>
          <fieldset>
            <FormInputLabel htmlFor="bedroom_count">Dormitorios</FormInputLabel>
            <input
              id="bedroom_count"
              {...register("bedroom_count")}
              required
              className={inputClassName}
            />
          </fieldset>
          <fieldset>
            <FormInputLabel htmlFor="bathroom_count">Ba&ntilde;os</FormInputLabel>
            <input
              id="bathroom_count"
              {...register("bathroom_count")}
              required
              className={inputClassName}
            />
          </fieldset>
          <fieldset>
            <FormInputLabel htmlFor="floor">Pisos disponibles</FormInputLabel>
            <input id="floor" {...register("floor")} required className={inputClassName} />
          </fieldset>
          <fieldset>
            <FormInputLabel htmlFor="stock">Disponibles</FormInputLabel>
            <input id="stock" {...register("stock")} required className={inputClassName} />
          </fieldset>
        </FormSection>
        <FormFooter>
          <SecondaryButton href={`/admin/property/edit/${propertyId}/typologies`}>
            Cancelar
          </SecondaryButton>
          <PrimaryButton isLoading={isSubmitting} title="Guardar">
            Guardar
          </PrimaryButton>
        </FormFooter>
      </div>
    </form>
  );
}
