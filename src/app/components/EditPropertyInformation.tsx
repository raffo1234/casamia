import { useEffect, useMemo } from "react";
import useSWR, { mutate } from "swr";
import { supabase } from "@lib/supabase";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  PropertyCurrency,
  PropertyPhase,
  PropertyState,
  PropertyType,
} from "@types/propertyState";
import { message } from "antd";
import FormSkeleton from "./FormSkeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Uploader from "./Uploader";
import { Icon } from "@iconify/react";
import { getAdminPropertiesUserKey } from "src/constants";
import PropertyImagesEdition from "./PropertyImagesEdition";

type Inputs = {
  title: string;
  description: string;
  location: string;
  state: boolean;
  phase: boolean;
  type: boolean;
  area: boolean;
  bathroom_count: string;
  bedroom_count: string;
  company_id: string;
  size: string;
  price: string;
  created_at: string;
  delivery_at: string;
  currency: string;
};

async function fetcher(id: string) {
  const { data, error } = await supabase
    .from("property")
    .select("*, property_image(image_url)")
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
  hideModal,
}: {
  id: string;
  userId: string;
  hideModal: () => void;
}) {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: companies } = useSWR(`${userId}-companies`, () =>
    fetcherCompany(userId),
  );
  const { data, error, isLoading, mutate } = useSWR(id, () => fetcher(id));

  const { reset, register, handleSubmit } = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: useMemo(() => {
      return data;
    }, [data, companies]),
  });

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Item updated successfully!",
    });
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await supabase
        .from("property")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      await mutate();
      await mutate(getAdminPropertiesUserKey(userId));
      success();
    } catch {
      console.error(error);
    } finally {
      hideModal();
    }
  };

  const mutatePropertyImages = () => {
    mutate();
  };

  useEffect(() => {
    reset(data);
  }, [data, companies]);

  if (error) return <div>Error cargando datos ...</div>;

  return isLoading ? (
    <FormSkeleton rows={2} />
  ) : (
    <>
      {contextHolder}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-start gap-6">
          <nav className="hidden xl:block rounded-xl border border-gray-100 w-60">
            <button
              type="button"
              className="bg-white px-6 py-3 text-left block border-b rounded-t-xl border-gray-100 w-full hover:bg-gray-50"
            >
              Informacion Basica
            </button>
            <button
              type="button"
              className="bg-white px-6 py-3 text-left block border-b border-gray-100 w-full hover:bg-gray-50 "
            >
              Detalles
            </button>
            <button
              type="button"
              className="bg-white px-6 py-3 text-left block w-full hover:bg-gray-50 rounded-b-xl"
            >
              Photos
            </button>
          </nav>
          <div className="flex-1 flex flex-col gap-7">
            <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
              <h2 className="font-semibold">Subir Imágenes</h2>
              <Uploader
                propertyId={id}
                onUploadSuccess={mutatePropertyImages}
              />
            </div>
            <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
              <h2 className="font-semibold">Imágenes</h2>
              <PropertyImagesEdition propertyImages={data.property_image} />
            </div>
            <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
              <h2 className="font-semibold">Estado</h2>
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
            </div>
            <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
              <h2 className="font-semibold">Tipo</h2>
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
            </div>
            <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
              <h2 className="font-semibold">Empresa</h2>
              <fieldset className="flex items-center gap-4 w-full">
                <select
                  id="company_id"
                  {...register("company_id")}
                  required
                  className="w-full -m-[1px] px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500"
                >
                  {companies?.map(({ id, name }) => {
                    return (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </fieldset>
            </div>
            <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
              <h2 className="font-semibold">Fase</h2>
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
            </div>
            <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
              <h2 className="font-semibold">Dormitorios</h2>
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
            </div>
            <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
              <h2 className="font-semibold">Ba&ntilde;os</h2>
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
            </div>
            <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
              <h2 className="font-semibold">Detalles</h2>
              <div className="flex gap-5 items-center">
                <fieldset>
                  <div className="flex items-center">
                    <div className="w-30">
                      <label
                        htmlFor="currency"
                        className="inline-block mb-2 text-sm"
                      >
                        Moneda
                      </label>
                      <select
                        id="currency"
                        defaultValue={PropertyCurrency.SOLES}
                        {...register("currency")}
                        className="w-full focus:z-10 px-3 py-2.5 rounded-l-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500"
                      >
                        <option value={PropertyCurrency.SOLES}>
                          S/. Soles
                        </option>
                        <option value={PropertyCurrency.DOLARES}>
                          USD Dolares
                        </option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="price"
                        className="inline-block mb-2 text-sm"
                      >
                        Precio
                      </label>
                      <input
                        type="text"
                        id="price"
                        {...register("price")}
                        required
                        className="w-full -m-[1px] px-3 py-2.5 focus:z-10 rounded-r-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500"
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
            </div>
            <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
              <h2 className="font-semibold">Information Basica</h2>
              <fieldset>
                <label htmlFor="title" className="inline-block mb-2 text-sm">
                  Titulo
                </label>
                <input
                  type="text"
                  id="title"
                  {...register("title")}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500"
                />
              </fieldset>
              <fieldset>
                <label htmlFor="location" className="inline-block mb-2 text-sm">
                  Ubicacion
                </label>
                <input
                  type="text"
                  id="location"
                  {...register("location")}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500"
                />
              </fieldset>
              <fieldset>
                <label
                  htmlFor="description"
                  className="inline-block mb-2 text-sm"
                >
                  Descripcion
                </label>
                <textarea
                  id="decription"
                  {...register("description")}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-cyan-100  focus:border-cyan-500"
                />
              </fieldset>
            </div>
            <footer className="justify-end flex items-center gap-2">
              <button
                type="button"
                onClick={hideModal}
                className="font-semibold disabled:border-gray-100 disabled:bg-gray-100 inline-block py-3 px-10 bg-white text-sm border border-gray-100 rounded-lg transition-colors hover:border-gray-200 duration-500 active:border-gray-300"
              >
                Cancelar
              </button>
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
