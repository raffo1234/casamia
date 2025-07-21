"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import getLastSlashValueFromCurrentUrl from "@/utils/getLastSlashValueFromCurrentUrl";
import useSWR, { mutate } from "swr";
// import { signIn } from "auth-astro/client";
import { useGlobalState } from "@/lib/globalState";
import Logo from "./Logo";
import fetcherUser, { useKeyUser } from "@/lib/fetcherUser";

const fetcherByUser = async (propertyId: string, userEmail: string) => {
  const { count, error } = await supabase
    .from("like")
    .select("user_id", { count: "exact", head: true })
    .eq("property_id", propertyId)
    .eq("user_id", userEmail);

  if (error) throw error;
  return count;
};

const fetcherByProperty = async (propertyId: string) => {
  const { count, error } = await supabase
    .from("like")
    .select("property_id", { count: "exact", head: true })
    .eq("property_id", propertyId);

  if (error) throw error;
  return count;
};

export default function Like({
  propertyId,
  userEmail,
  size = "medium",
  hasCounter = false,
}: {
  propertyId: string;
  size?: "medium" | "small";
  hasCounter?: boolean;
  userEmail: string | undefined | null;
}) {
  const { setModalContent, setModalOpen } = useGlobalState();
  const [isLiking, setIsLiking] = useState(false);
  const keyUser = useKeyUser(userEmail);
  const keyByUser = `${userEmail}-${propertyId}-user-like`;
  const keyByProperty = `${userEmail}-${propertyId}-property-like`;

  const { data: user, isLoading: isLoadingUser } = useSWR(keyUser, () =>
    userEmail ? fetcherUser(userEmail) : null
  );

  const {
    data: countByUser,
    mutate: mutateByUser,
    isLoading: isLoadingByUser,
  } = useSWR(keyByUser, () =>
    user?.id ? fetcherByUser(propertyId, user.id) : null
  );

  const {
    data: countByProperty,
    mutate: mutateByProperty,
    isLoading: isLoadingByProperty,
  } = useSWR(keyByProperty, () => fetcherByProperty(propertyId));

  const showGlobalModal = () => {
    setModalContent(
      <>
        <div className="mb-12">
          <Logo />
        </div>
        <h3 className="text-xl mb-10 w-full text-center">
          Para indicar que te gusta, inicia sesion.
        </h3>
        <button
          // onClick={() => signIn("google")}
          className="text-lg block w-full px-6 pb-4 pt-3 bg-black text-white rounded-full transition-colors duration-700 hover:bg-gray-800 active:bg-gray-900"
        >
          Iniciar Sesión
        </button>
      </>
    );
    setModalOpen(true);
  };

  const handleLike = async (
    propertyId: string,
    userEmail: string | null | undefined
  ) => {
    const lastSlashValue = getLastSlashValueFromCurrentUrl() || "";

    if (!userEmail) {
      showGlobalModal();
      return;
    }

    setIsLiking(true);
    if (countByUser === 0) {
      await supabase.from("like").insert([
        {
          property_id: propertyId,
          user_id: user?.id,
        },
      ]);
      await mutateByUser();
      await mutateByProperty();
      setIsLiking(false);

      if (!lastSlashValue.includes("favorito")) {
        await mutate(`${user?.id}-likes-properties`, null);
      }
    } else {
      await supabase
        .from("like")
        .delete()
        .eq("property_id", propertyId)
        .eq("user_id", user?.id);
      await mutateByUser();
      await mutateByProperty();
      setIsLiking(false);

      if (!lastSlashValue.includes("favorito")) {
        await mutate(`${user?.id}-likes-properties`, null);
      }
    }
  };

  useEffect(() => {
    if (userEmail) {
      mutateByUser();
    }
  }, [isLoadingUser]);

  if (isLoadingUser || isLoadingByUser || isLoadingByProperty) return null;

  return (
    <button
      onClick={() => handleLike(propertyId, userEmail)}
      className={`${
        size === "medium" && countByUser
          ? "bg-cyan-50 text-cyan-300"
          : "bg-gray-50 hover:text-gray-500"
      } 
          ${
            isLoadingByUser || isLoadingUser ? "opacity-0" : "opacity-100"
          }          
          transition-all p-3 rounded-full duration-300 flex gap-1 items-center`}
    >
      {isLiking ? (
        <svg
          className={`${
            size === "small" ? "text-lg text-gray-500" : "text-2xl"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path
              strokeDasharray="16"
              strokeDashoffset="16"
              d="M12 3c4.97 0 9 4.03 9 9"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.3s"
                values="16;0"
              />
              <animateTransform
                attributeName="transform"
                dur="1.5s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              />
            </path>
            <path
              strokeDasharray="64"
              strokeDashoffset="64"
              strokeOpacity="0.3"
              d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="1.2s"
                values="64;0"
              />
            </path>
          </g>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={`${size === "small" ? "19" : "24"}`}
          height={`${size === "small" ? "19" : "24"}`}
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M2 9.137C2 14 6.02 16.591 8.962 18.911C10 19.729 11 20.5 12 20.5s2-.77 3.038-1.59C17.981 16.592 22 14 22 9.138S16.5.825 12 5.501C7.5.825 2 4.274 2 9.137"
          />
        </svg>
      )}
      {hasCounter ? (
        <span className="text-xs min-w-2 block">{countByProperty}</span>
      ) : null}
    </button>
  );
}
