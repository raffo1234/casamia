"use client";

import TextareaAutosize from "react-textarea-autosize";
import { NumericFormat } from "react-number-format";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import { supabase } from "@/lib/supabase";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import {
  PropertyPhase,
  PropertyState,
  PropertyType,
} from "@/types/propertyState";
import FormSkeleton from "./FormSkeleton";
import { Icon } from "@iconify/react";
import { getAdminPropertiesUserKey } from "@/constants";
import Link from "next/link";
import { redirect } from "next/navigation";
import { generateUniqueSlug } from "@/lib/supabase/generateUniqueSlug";
import toast from "react-hot-toast";
import FormSection from "./FormSection";
import FormSectionTitle from "./FormSectionTitle";
import FormInputLabel from "./FormInputLabel";
import MonthPicker from "./MonthPicker";
import { CurrencyCode } from "@/enums/currencyCodes";

type Inputs = {
  title: string;
  description: string;
  location: string;
  google_map: string;
  state: string;
  phase: string;
  type: string;
  bathroom_count: string;
  bedroom_count: string;
  company_id?: string;
  size: string;
  price: string;
  created_at: string;
  delivery_at: string;
  currency: string;
  property_image?: {
    image_url: string;
  }[];
  slug?: string;
};

async function fetcher(id: string) {
  const { data, error } = await supabase
    .from("property")
    .select("*, property_image(id, image_url)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

async function fetcherCompany(userId: string) {
  const { data, error } = await supabase
    .from("company")
    .select("id, name")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}

export default function EditPropertyInformation({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const { data: companies } = useSWR(`${userId}-companies`, () =>
    fetcherCompany(userId)
  );
  const {
    data: property,
    error,
    isLoading,
    mutate: mutateProperty,
  } = useSWR(id, () => fetcher(id));

  const { reset, register, handleSubmit, control, watch } = useForm<Inputs>({
    mode: "onBlur",
  });

  const hasDeliveryAt =
    watch("phase") === PropertyPhase.CONSTRUCCION ||
    watch("phase") === PropertyPhase.PLANOS;

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    let newSlug = null;

    const companyId = data.company_id === "" ? null : data.company_id;

    if (data.title !== property.title || !property.slug) {
      newSlug = await generateUniqueSlug("property", data.title, property.id);
    }

    const { property_image, ...rest } = data;
    try {
      const updatePayload = { ...rest };
      if (newSlug) {
        updatePayload.slug = newSlug;
      }

      await supabase
        .from("property")
        .update({ ...updatePayload, company_id: companyId })
        .eq("id", id)
        .select()
        .single();
      await mutateProperty();
      await mutate(() => getAdminPropertiesUserKey(userId));
      toast.success("Inmueble actualizado exitosamente.");
    } catch (err) {
      console.error(err);
      console.error({ property_image });
    } finally {
      redirect("/admin/property");
    }
  };

  useEffect(() => {
    reset(property);
  }, [property, reset]);

  if (error) return <div>Error cargando datos ...</div>;

  return isLoading ? (
    <FormSkeleton rows={2} />
  ) : (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-start gap-6">
          <div className="flex-1 flex flex-col gap-7">
            <FormSection>
              <FormSectionTitle>Informaci&oacute;n General</FormSectionTitle>
              <fieldset>
                <FormInputLabel htmlFor="title">T&iacute;tulo</FormInputLabel>
                <input
                  type="text"
                  id="title"
                  {...register("title")}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500"
                />
              </fieldset>
              <fieldset>
                <FormInputLabel htmlFor="slug">
                  Slug{" "}
                  <span className="text-xs block font-semibold mt-1">
                    Es usado en el URL del inmueble
                  </span>
                </FormInputLabel>
                <input
                  disabled
                  type="text"
                  id="slug"
                  {...register("slug")}
                  required
                  className="disabled:bg-slate-100 w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500"
                />
              </fieldset>
              <fieldset>
                <FormInputLabel htmlFor="location">Ubicacion</FormInputLabel>
                <input
                  type="text"
                  id="location"
                  {...register("location")}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500"
                />
              </fieldset>
              <fieldset>
                <FormInputLabel htmlFor="google_map">Google Map</FormInputLabel>
                <input
                  type="text"
                  id="google_map"
                  {...register("google_map")}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500"
                />
              </fieldset>
              <fieldset>
                <FormInputLabel htmlFor="description">
                  Descripcion
                </FormInputLabel>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextareaAutosize
                      {...field}
                      id="decription"
                      autoFocus
                      minRows={2}
                      placeholder=""
                      aria-label=""
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500"
                    />
                  )}
                />
              </fieldset>
            </FormSection>
            <FormSection>
              <FormSectionTitle>Estado</FormSectionTitle>
              <fieldset className="flex items-center gap-4 w-full">
                <div className="w-1/2">
                  <input
                    {...register("state")}
                    type="radio"
                    id="state_1"
                    value={PropertyState.DRAFT}
                    className="peer hidden"
                    defaultChecked
                  />
                  <label
                    htmlFor="state_1"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    <span className="flex items-center flex-col gap-1">
                      <Icon
                        icon="solar:document-add-broken"
                        fontSize={24}
                        className="block"
                      />
                      <span>Borrador</span>
                    </span>
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    {...register("state")}
                    value={PropertyState.PENDING}
                    type="radio"
                    id="state_2"
                    className="peer hidden"
                  />
                  <label
                    htmlFor="state_2"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    <span className="flex items-center flex-col gap-1">
                      <Icon
                        icon="solar:checklist-minimalistic-broken"
                        fontSize={24}
                        className="block"
                      />
                      <span>Pendiente</span>
                    </span>
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    {...register("state")}
                    value={PropertyState.ACTIVE}
                    type="radio"
                    id="state_3"
                    className="peer hidden"
                  />
                  <label
                    htmlFor="state_3"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    <span className="flex items-center flex-col gap-1">
                      <Icon
                        icon="solar:shield-network-broken"
                        fontSize={24}
                        className="block"
                      />
                      <span>Publicado</span>
                    </span>
                  </label>
                </div>
              </fieldset>
            </FormSection>
            <FormSection>
              <FormSectionTitle>Tipo</FormSectionTitle>
              <fieldset className="flex items-center gap-4 w-full">
                <div className="w-1/2">
                  <input
                    {...register("type")}
                    type="radio"
                    id="type_1"
                    value={PropertyType.APARTMENT}
                    className="peer hidden"
                    defaultChecked
                  />
                  <label
                    htmlFor="type_1"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    <span className="flex items-center flex-col gap-1">
                      <Icon
                        icon="solar:buildings-broken"
                        fontSize={32}
                        className="block"
                      />
                      <span>Departamento</span>
                    </span>
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    {...register("type")}
                    value={PropertyType.HOUSE}
                    type="radio"
                    id="type_2"
                    className="peer hidden"
                  />
                  <label
                    htmlFor="type_2"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    <span className="flex items-center flex-col gap-1">
                      <Icon
                        icon="solar:home-2-broken"
                        fontSize={32}
                        className="block"
                      />
                      <span>Casa</span>
                    </span>
                  </label>
                </div>
              </fieldset>
            </FormSection>
            <FormSection>
              <FormSectionTitle>Empresa</FormSectionTitle>
              <FormInputLabel htmlFor="company_id">
                Por defecto, la autoría de esta publicación se asignará a tu
                perfil. Puedes cambiarlo seleccionando una empresa.
              </FormInputLabel>
              <fieldset className="flex items-center gap-4 w-full">
                <select
                  id="company_id"
                  {...register("company_id")}
                  defaultValue={property.company_id || ""}
                  className="w-full -m-[1px] px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500"
                >
                  <option value="">Selecciona Empresa</option>
                  {companies?.map(({ id, name }) => {
                    return (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </fieldset>
            </FormSection>
            <FormSection>
              <FormSectionTitle>Fase</FormSectionTitle>
              <fieldset className="flex items-center gap-4 w-full">
                <div className="w-1/2">
                  <input
                    {...register("phase")}
                    type="radio"
                    id="phase_1"
                    value={PropertyPhase.PLANOS}
                    className="peer hidden"
                    defaultChecked
                  />
                  <label
                    htmlFor="phase_1"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    <span className="flex items-center flex-col gap-1">
                      <Icon
                        icon="solar:wallpaper-broken"
                        fontSize={24}
                        className="block"
                      />
                      <span>En Planos</span>
                    </span>
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    {...register("phase")}
                    value={PropertyPhase.CONSTRUCCION}
                    type="radio"
                    id="phase_2"
                    className="peer hidden"
                  />
                  <label
                    htmlFor="phase_2"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    <span className="flex items-center flex-col gap-1">
                      <Icon
                        icon="solar:chart-broken"
                        fontSize={24}
                        className="block"
                      />
                      <span>En Construccion</span>
                    </span>
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    {...register("phase")}
                    value={PropertyPhase.READY}
                    type="radio"
                    id="phase_3"
                    className="peer hidden"
                  />
                  <label
                    htmlFor="phase_3"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    <span className="flex items-center flex-col gap-1">
                      <Icon
                        icon="solar:key-square-2-outline"
                        fontSize={24}
                        className="block"
                      />
                      <span>Entrega Inmediata</span>
                    </span>
                  </label>
                </div>
              </fieldset>
              {hasDeliveryAt ? (
                <fieldset>
                  <FormInputLabel htmlFor="delivery_at">
                    Fecha de Entrega
                  </FormInputLabel>
                  <div>
                    <Controller
                      name="delivery_at"
                      rules={{
                        required: hasDeliveryAt
                          ? "La fecha de entrega es obligatoria"
                          : false,
                      }}
                      control={control}
                      render={({ field }) => (
                        <MonthPicker
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </fieldset>
              ) : null}
            </FormSection>
            <FormSection>
              <FormSectionTitle>Dormitorios</FormSectionTitle>
              <fieldset className="flex items-center gap-4 w-full">
                <input
                  id="bedroom_count"
                  type="number"
                  defaultValue={1}
                  {...register("bedroom_count")}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500"
                />
              </fieldset>
            </FormSection>
            <FormSection>
              <FormSectionTitle>Ba&ntilde;os</FormSectionTitle>
              <fieldset className="flex items-center gap-4 w-full">
                <input
                  type="number"
                  defaultValue={1}
                  {...register("bathroom_count")}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500"
                />
              </fieldset>
            </FormSection>
            <FormSection>
              <FormSectionTitle>Detalles</FormSectionTitle>
              <div className="flex gap-5 items-center">
                <fieldset>
                  <div className="flex gap-5 items-center">
                    <div>
                      <label className="inline-block mb-2 text-sm">
                        Moneda
                      </label>
                      <div className="flex items-center">
                        <div className="w-1/2">
                          <input
                            {...register("currency")}
                            value={CurrencyCode.PEN}
                            type="radio"
                            id="currency_soles"
                            className="peer hidden"
                            defaultChecked
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
                      <label
                        htmlFor="price"
                        className="inline-block mb-2 text-sm"
                      >
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
                </fieldset>
                <fieldset>
                  <label htmlFor="size" className="inline-block mb-2 text-sm">
                    Tama&ntilde;o (m<sup>2</sup> )
                  </label>
                  <input
                    type="number"
                    id="size"
                    {...register("size")}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500"
                  />
                </fieldset>
              </div>
            </FormSection>
            <footer className="justify-end flex items-center gap-2">
              <Link
                href={`/admin/property`}
                className="font-semibold disabled:border-gray-100 disabled:bg-gray-100 inline-block py-3 px-10 bg-white text-sm border border-gray-100 rounded-lg transition-colors hover:border-gray-200 duration-500 active:border-gray-300"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="text-white font-semibold disabled:border-gray-100 disabled:bg-gray-100 inline-block py-3 px-10 text-sm bg-cyan-500 hover:bg-cyan-400 transition-colors duration-500 rounded-lg"
              >
                Guardar
              </button>
            </footer>
          </div>
        </div>
      </form>
    </>
  );
}
