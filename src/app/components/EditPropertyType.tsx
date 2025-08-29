"use client";

import { useEffect, useMemo } from "react";
import useSWR, { mutate } from "swr";
import { supabase } from "@/lib/supabase";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import FormSkeleton from "./FormSkeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Title from "./Title";
import HeaderTitle from "./HeaderTitle";
import BackLink from "./BackLink";
import TypologyAdminTabs from "./TypologyAdminTabs";
import FormSection from "./FormSection";
import FormSectionTitle from "./FormSectionTitle";
import FormInputLabel from "./FormInputLabel";
import { NumericFormat } from "react-number-format";
import { CurrencyCode } from "@/enums/currencyCodes";

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
};

async function fetcher(typologyId: string) {
  const { data, error } = await supabase
    .from("typology")
    .select("*")
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
  } = useSWR(`${typologyId}-no-images`, () => fetcher(typologyId));

  const { reset, register, control, handleSubmit } = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: useMemo(() => {
      return typology;
    }, [typology]),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await supabase.from("typology").update(data).eq("id", typologyId);

      await mutate(typologyId);
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
      <HeaderTitle>
        <Title>Editar Tipologia</Title>
        <BackLink
          href={`/admin/property/edit/${propertyId}/typologies`}
        ></BackLink>
      </HeaderTitle>
      <TypologyAdminTabs />
      <form onSubmit={handleSubmit(onSubmit)} id="editProperty">
        <div className="flex flex-col gap-6">
          <FormSection>
            <FormSectionTitle>Información General</FormSectionTitle>
            <fieldset>
              <FormInputLabel htmlFor="created_at">Creado</FormInputLabel>
              <input
                type="text"
                disabled
                value={format(
                  new Date(typology.created_at),
                  "dd MMMM, yyyy - hh:MM aaa",
                  {
                    locale: es,
                  }
                )}
                className="disabled:bg-slate-100 w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
            </fieldset>
            <fieldset>
              <FormInputLabel htmlFor="name">Nombre</FormInputLabel>
              <input
                type="text"
                id="name"
                {...register("name")}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
            </fieldset>
            <fieldset>
              <FormInputLabel htmlFor="description">Descripcion</FormInputLabel>
              <textarea
                id="description"
                {...register("description")}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
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
                Area (m<sup>2</sup>)
              </FormInputLabel>
              <input
                id="size"
                {...register("size")}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
            </fieldset>
            <fieldset>
              <FormInputLabel htmlFor="bedroom_count">
                Dormitorios
              </FormInputLabel>
              <input
                id="bedroom_count"
                {...register("bedroom_count")}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
            </fieldset>
            <fieldset>
              <FormInputLabel htmlFor="bathroom_count">Banios</FormInputLabel>
              <input
                id="bathroom_count"
                {...register("bathroom_count")}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
            </fieldset>
            <fieldset>
              <FormInputLabel htmlFor="floor">Pisos disponibles</FormInputLabel>
              <input
                id="floor"
                {...register("floor")}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
            </fieldset>
            <fieldset>
              <FormInputLabel htmlFor="stock">Disponibles</FormInputLabel>
              <input
                id="stock"
                {...register("stock")}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
            </fieldset>
          </FormSection>
          <footer className="flex items-center gap-2 pt-4 mt-4 justify-end">
            <Link href={`/admin/property/edit/${propertyId}/typologies`}>
              Cancel
            </Link>
            <button type="submit">Guardar</button>
          </footer>
        </div>
      </form>
    </>
  );
}
