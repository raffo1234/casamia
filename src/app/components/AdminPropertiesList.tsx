"use client";

import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import DeleteProperty from "@/components/DeleteProperty";
import { PropertyState, Permissions } from "@/types/propertyState";
import { Icon } from "@iconify/react";
import CheckPermission from "@/components/CheckPermission";
import EditPropertyModal from "./EditPropertyModal";
import FirstImage from "./FirstImage";
import { getAdminPropertiesUserKey } from "@/constants";
import Link from "next/link";
import EditLink from "./EditButton";
import { Suspense } from "react";
import PropertiesAdminGrid from "./PropertiesAdminGrid";

type Props = {
  id: string;
  title: string;
  state: string;
  userId: string;
  propertyImage: {
    image_url: string;
  }[];
};

const AdminPropertyItem = ({ id, title, state, userId, propertyImage }: Props) => {
  return (
    <article className="bg-white rounded-3xl overflow-hidden relative">
      <Link href={`/admin/property/edit/${id}/images`}>
        <FirstImage title={title} src={propertyImage?.at(0)?.image_url} />
      </Link>
      <div
        className={`rounded-bl-3xl absolute right-0 top-0 text-xs py-2 px-8 
            ${state === PropertyState.DRAFT ? "bg-gray-600 text-white" : ""}
            ${state === PropertyState.PENDING ? "bg-cyan-600 text-white" : ""}
            ${state === PropertyState.ACTIVE ? "bg-green-600 text-white" : ""}
            `}
      >
        {state}
      </div>
      <div className="border px-4 border-b rounded-b-3xl py-5 border-slate-100">
        <h2 className="mb-5 text-xl line-clamp-1">{title}</h2>
        <div className="flex gap-2 justify-center">
          <EditLink href={`/admin/property/edit/${id}`} />
          <DeleteProperty id={id} userId={userId} />
        </div>
      </div>
    </article>
  );
};

const fetcher = async (userId: string) => {
  const { data, error } = await supabase
    .from("property")
    .select(
      `
      id,
      title,
      state,
      property_image(image_url)
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export default function AdminPropertiesList({
  userId,
  userRoleId,
}: {
  userRoleId: string;
  userId: string;
}) {
  const {
    data: properties,
    error,
    isLoading,
  } = useSWR(getAdminPropertiesUserKey(userId), () => fetcher(userId));

  if (isLoading)
    return (
      <PropertiesAdminGrid>
        <div className="bg-slate-100 animate-pulse rounded-3xl h-[300px]"></div>
        <div className="bg-slate-100 animate-pulse rounded-3xl h-[300px]"></div>
        <div className="bg-slate-100 animate-pulse rounded-3xl h-[300px]"></div>
      </PropertiesAdminGrid>
    );

  if (error) return null;

  return (
    <>
      <PropertiesAdminGrid>
        <Suspense>
          <CheckPermission userRoleId={userRoleId} requiredPermission={Permissions.CREAR_INMUEBLE}>
            <Link
              href="/admin/property/add"
              title="Agregar Inmueble"
              className="hover:bg-gray-200 min-h-30 transition-colors active:bg-gray-300 bg-gray-100 rounded-3xl flex justify-center items-center"
            >
              <Icon icon="material-symbols-light:add-2-rounded" className="text-3xl" />
            </Link>
          </CheckPermission>
        </Suspense>
        {properties?.map((property) => {
          const { id, title, state, property_image } = property;

          return (
            <AdminPropertyItem
              key={id}
              id={id}
              propertyImage={property_image}
              userId={userId}
              title={title}
              state={state}
            />
          );
        })}
      </PropertiesAdminGrid>
      <EditPropertyModal />
    </>
  );
}
