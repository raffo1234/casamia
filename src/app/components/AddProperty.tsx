"use client";

import TextareaAutosize from "react-textarea-autosize";
import { supabase } from "@/lib/supabase";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import {
  PropertyPhase,
  PropertyState,
  PropertyType,
} from "@/types/propertyState";
import { Icon } from "@iconify/react";
import { NumericFormat } from "react-number-format";
import Title from "./Title";
import slugify from "slugify";
import { CurrencyCode } from "@/enums/currencyCodes";
import FormInputLabel from "./FormInputLabel";
import FormSection from "./FormSection";
import FormFooter from "./FormFooter";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";
import { useState } from "react";
import BackLink from "./BackLink";
import FormSectionTitle from "./FormSectionTitle";
import { inputClassName } from "@/constants";
import { TransactionType } from "@/types/TransactionType";

type Inputs = {
  title: string;
  description: string;
  location: string;
  image: string;
  type: string;
  bedroom_count: number;
  bathroom_count: number;
  phase: string;
  price: string;
  size: string;
  currency: string;
  state: string;
  slug: string;
  transaction_type: string;
};

export default function AddProperty({ userId }: { userId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  const { reset, register, handleSubmit, control } = useForm<Inputs>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsAdding(true);

    const slug = slugify(data.title, {
      lower: true,
      strict: true,
      locale: "es",
    });

    try {
      const { error } = await supabase
        .from("property")
        .insert([{ ...data, user_id: userId, slug }]);

      console.warn(error);

      reset();
      window.location.href = "/admin/property";
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="w-full mb-8 flex justify-between items-center">
        <Title>Agregar Inmueble</Title>
        <BackLink href={`/admin/property`}></BackLink>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-start gap-6">
          <div className="flex-1 flex flex-col gap-6">
            <FormSection>
              <FormSectionTitle>Information Basica</FormSectionTitle>
              <fieldset>
                <FormInputLabel htmlFor="title">Titulo</FormInputLabel>
                <input
                  type="text"
                  id="title"
                  {...register("title")}
                  required
                  className={inputClassName}
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
                  className={inputClassName}
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
              <FormSectionTitle>Transaci&oacute;n</FormSectionTitle>
              <fieldset className="flex items-center gap-4 w-full">
                <div className="w-1/2">
                  <input
                    {...register("transaction_type")}
                    type="radio"
                    id="venta"
                    value={TransactionType.VENTA}
                    className="peer hidden"
                    defaultChecked
                  />
                  <label
                    htmlFor="venta"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    <span className="flex items-center flex-col gap-1">
                      <Icon
                        icon="solar:document-add-broken"
                        fontSize={24}
                        className="block"
                      />
                      <span>Venta</span>
                    </span>
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    {...register("transaction_type")}
                    value={TransactionType.ALQUILER}
                    type="radio"
                    id="alquiler"
                    className="peer hidden"
                  />
                  <label
                    htmlFor="alquiler"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    <span className="flex items-center flex-col gap-1">
                      <Icon
                        icon="solar:checklist-minimalistic-broken"
                        fontSize={24}
                        className="block"
                      />
                      <span>Alquiler</span>
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
            </FormSection>
            <FormSection>
              <FormSectionTitle>Dormitorios</FormSectionTitle>
              <fieldset className="flex items-center gap-4 w-full">
                <div className="w-1/2">
                  <input
                    {...register("bedroom_count")}
                    type="radio"
                    id="bedroom_count_1"
                    value={1}
                    className="peer hidden"
                    defaultChecked
                  />
                  <label
                    htmlFor="bedroom_count_1"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    1
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    {...register("bedroom_count")}
                    value={2}
                    type="radio"
                    id="bedroom_count_2"
                    className="peer hidden"
                  />
                  <label
                    htmlFor="bedroom_count_2"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    2
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    {...register("bedroom_count")}
                    value={3}
                    type="radio"
                    id="bedroom_count_3"
                    className="peer hidden"
                  />
                  <label
                    htmlFor="bedroom_count_3"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    3
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    {...register("bedroom_count")}
                    value={4}
                    type="radio"
                    id="bedroom_count_4"
                    className="peer hidden"
                  />
                  <label
                    htmlFor="bedroom_count_4"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    4
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    {...register("bedroom_count")}
                    value={5}
                    type="radio"
                    id="bedroom_count_5"
                    className="peer hidden"
                  />
                  <label
                    htmlFor="bedroom_count_5"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    5
                  </label>
                </div>
              </fieldset>
            </FormSection>
            <FormSection>
              <FormSectionTitle>Ba&ntilde;os</FormSectionTitle>
              <fieldset className="flex items-center gap-4 w-full">
                <div className="w-1/2">
                  <input
                    {...register("bathroom_count")}
                    type="radio"
                    id="bathroom_count_1"
                    value={1}
                    className="peer hidden"
                    defaultChecked
                  />
                  <label
                    htmlFor="bathroom_count_1"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    1
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    {...register("bathroom_count")}
                    value={2}
                    type="radio"
                    id="bathroom_count_2"
                    className="peer hidden"
                  />
                  <label
                    htmlFor="bathroom_count_2"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    2
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    {...register("bathroom_count")}
                    value={3}
                    type="radio"
                    id="bathroom_count_3"
                    className="peer hidden"
                  />
                  <label
                    htmlFor="bathroom_count_3"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    3
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    {...register("bathroom_count")}
                    value={4}
                    type="radio"
                    id="bathroom_count_4"
                    className="peer hidden"
                  />
                  <label
                    htmlFor="bathroom_count_4"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    4
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    {...register("bathroom_count")}
                    value={5}
                    type="radio"
                    id="bathroom_count_5"
                    className="peer hidden"
                  />
                  <label
                    htmlFor="bathroom_count_5"
                    className="flex items-center justify-center aspect-[4/2] transition-all duration-300 cursor-pointer select-none rounded-xl p-2 text-center border peer-checked:border-cyan-500 peer-checked:bg-cyan-50"
                  >
                    5
                  </label>
                </div>
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
                    className={inputClassName}
                  />
                </fieldset>
              </div>
            </FormSection>
            <FormFooter>
              <SecondaryButton href={`/admin/property`}>
                Cancelar
              </SecondaryButton>
              <PrimaryButton isLoading={isAdding} title="Agregar">
                Agregar
              </PrimaryButton>
            </FormFooter>
          </div>
        </div>
      </form>
    </>
  );
}
