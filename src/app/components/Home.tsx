"use client";

import PropertyItem from "@/components/PropertyItem";
import { use } from "react";

export default function Home({
  propertiesPromise,
  userEmail,
}: {
  propertiesPromise: Promise<any>;
  userEmail: string | undefined;
}) {
  const { data: properties } = use(propertiesPromise);

  return (
    <>
      {properties?.map((property) => {
        return (
          <PropertyItem
            key={property.id}
            userEmail={userEmail}
            property={property}
          />
        );
      })}
    </>
  );
}
