"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
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
  size = 16,
  hasBg = true,
  hasPadding = true,
  hasCounter = false,
}: {
  propertyId: string;
  size?: number;
  hasBg?: boolean;
  hasPadding?: boolean;
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
        <h3 className="w-full mb-10 text-xl text-center">
          Para indicar que te gusta, inicia sesion.
        </h3>
        <button
          // onClick={() => signIn("google")}
          className="block w-full px-6 pt-3 pb-4 text-lg text-white transition-colors duration-700 bg-black rounded-full hover:bg-gray-800 active:bg-gray-900"
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
      await mutate(`${user?.id}-likes-properties`, null);
    } else {
      await supabase
        .from("like")
        .delete()
        .eq("property_id", propertyId)
        .eq("user_id", user?.id);
      await mutateByUser();
      await mutateByProperty();
      setIsLiking(false);
      await mutate(`${user?.id}-likes-properties`, null);
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
      className={`
          ${
            isLoadingByUser || isLoadingUser ? "opacity-0" : "opacity-100"
          }          
          ${hasPadding ? "p-2" : ""}
          ${
            hasBg ? "bg-black" : ""
          } transition-opacity rounded-full duration-300 flex gap-1 items-center`}
    >
      <span className="text-yellow-400">
        {isLiking ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
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
          <>
            {countByUser ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M16.5 3A5.49 5.49 0 0 0 12 5.344A5.49 5.49 0 0 0 7.5 3A5.5 5.5 0 0 0 2 8.5c0 5.719 6.5 10.438 10 12.85c3.5-2.412 10-7.131 10-12.85A5.5 5.5 0 0 0 16.5 3"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M16.5 4.5c2.206 0 4 1.794 4 4c0 4.669-5.543 8.941-8.5 11.023C9.043 17.441 3.5 13.169 3.5 8.5c0-2.206 1.794-4 4-4a4.01 4.01 0 0 1 3.273 1.706L12 7.953l1.227-1.746A4.01 4.01 0 0 1 16.5 4.5m0-1.5A5.49 5.49 0 0 0 12 5.344A5.49 5.49 0 0 0 7.5 3A5.5 5.5 0 0 0 2 8.5c0 5.719 6.5 10.438 10 12.85c3.5-2.412 10-7.131 10-12.85A5.5 5.5 0 0 0 16.5 3"
                />
              </svg>
            )}
          </>
        )}
      </span>
      {hasCounter ? (
        <span className="block text-xs min-w-2">{countByProperty}</span>
      ) : null}
    </button>
  );
}
