"use client";

import { supabase } from "@/lib/supabase";
import { Modal } from "antd";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputError from "./InputError";
import Image from "next/image";
import toast from "react-hot-toast";
import { CompanyType } from "@/types/companyType";
import { UserType } from "@/types/userType";
import PrimaryButton from "./PrimaryButton";
import { inputClassName } from "@/constants";
import FormInputLabel from "./FormInputLabel";

const formSchema = z.object({
  property_id: z
    .string()
    .min(1, { message: "Selecciona una opción" })
    .optional(),
  first_name: z.string().min(2, { message: "Nombre es requerido" }),
  last_name: z.string().min(2, { message: "Apellido es requerido" }),
  email: z
    .string()
    .min(1, { message: "Email es requerido" })
    .email({ message: "Ingresa un Email valido" }),
  phone: z.string().regex(/^([2-7]\d{7}|9\d{8})$/, {
    message: "Ingrese un teléfono valido.",
  }),
  message: z.string().min(2, { message: "Mensaje es requerido" }),
});

type Inputs = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  property_id?: string;
};

export default function GetInTouch({
  propertyId,
  propertyTitle,
  company,
  user,
}: {
  propertyId: string;
  propertyTitle: string;
  company?: CompanyType | undefined | null;
  user?: UserType | undefined | null;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const author = company ? company : user;

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const sendInquiry = () => {
    showModal();
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const { data: createdInquiry } = await supabase
        .from("inquiry")
        .insert({ ...data, property_id: propertyId })
        .select()
        .single();
      if (createdInquiry) {
        reset();
        toast.success("Hemos recibido tu mensaje correctamente");
      }
    } catch (error) {
      console.error(error);
    } finally {
      hideModal();
    }
  };

  return (
    <>
      <button
        onClick={sendInquiry}
        className="flex justify-center cursor-pointer hover:bg-yellow-400 transition-colors duration-300 gap-2 items-center bg-amber-400 mb-3 rounded-full mt-10 w-full px-4 py-4 font-semibold text-black"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <path
              strokeWidth="1.5"
              d="M10 22a8 8 0 1 0-7.22-4.55c.172.36.232.766.13 1.15l-.328 1.227a1.3 1.3 0 0 0 1.591 1.592L5.4 21.09a1.67 1.67 0 0 1 1.15.13c1.045.5 2.215.78 3.451.78Z"
            />
            <path
              strokeWidth="1.5"
              d="m18 14.502l.198-.087c.362-.165.768-.227 1.153-.124l.476.127a1.3 1.3 0 0 0 1.592-1.591l-.128-.476c-.103-.385-.04-.791.125-1.153A6.5 6.5 0 1 0 9.5 5.996"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6.518 14h.01m3.481 0h.009m3.482 0h.009"
            />
          </g>
        </svg>
        Contactar al vendedor
      </button>
      <Modal
        footer={null}
        style={{ top: 20 }}
        open={isModalOpen}
        onCancel={hideModal}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="p-4 flex flex-col gap-5">
            {author ? (
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={author.image_url}
                  alt={author?.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <h2 className="text-xs text-slate-400 mb-2">
                    Ponte en contacto con
                  </h2>
                  <h3 className="font-semibold font-inter-tight text-lg">
                    {author?.name}
                  </h3>
                  <div className="text-sm">
                    <span className="text-slate-400">Proyecto:</span>{" "}
                    {propertyTitle}
                  </div>
                </div>
              </div>
            ) : null}
            <div>
              <FormInputLabel htmlFor="email">Email</FormInputLabel>
              <input
                {...register("email")}
                id="email"
                className={inputClassName}
              />
              <InputError>{errors.email && errors.email.message}</InputError>
            </div>
            <div>
              <FormInputLabel htmlFor="first_name">Nombres</FormInputLabel>
              <input
                {...register("first_name")}
                id="first_name"
                className={inputClassName}
              />
              <InputError>
                {errors.first_name && errors.first_name.message}
              </InputError>
            </div>
            <div>
              <FormInputLabel htmlFor="last_name">Apellidos</FormInputLabel>
              <input
                {...register("last_name")}
                id="last_name"
                className={inputClassName}
              />
              <InputError>
                {errors.last_name && errors.last_name.message}
              </InputError>
            </div>
            <div>
              <FormInputLabel htmlFor="phone">Teléfono</FormInputLabel>
              <input
                {...register("phone")}
                id="phone"
                className={inputClassName}
              />
              <InputError>{errors.phone && errors.phone.message}</InputError>
            </div>
            <div>
              <FormInputLabel htmlFor="message">Mensaje</FormInputLabel>
              <textarea
                {...register("message")}
                id="message"
                className={inputClassName}
              />
              <InputError>
                {errors.message && errors.message.message}
              </InputError>
            </div>
            <PrimaryButton isFullWidth title="Enviar mensaje">
              Enviar Mensaje
            </PrimaryButton>
          </fieldset>
        </form>
      </Modal>
    </>
  );
}
