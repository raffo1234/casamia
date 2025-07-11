"use client";

import { useEffect } from "react";
import PropertiesGrid from "./PropertiesGrid";
import PropertiesList from "./PropertiesList";
import PropertyItem from "./PropertyItem";
import { useGlobalState } from "@/lib/globalState";
import { PropertyType } from "@/types/propertyType";

export default function Properties({
  properties,
  userEmail,
}: {
  properties: PropertyType[] | null;
  userEmail: string | null | undefined;
}) {
  const { propertyId, setPropertyId, show, hide } = useGlobalState();

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setPropertyId(event.state.page);
        show();
        const app = document.getElementById("app") as HTMLElement;
        app.classList.add("overflow-hidden");
      } else {
        hide();
        const app = document.getElementById("app") as HTMLElement;
        app.classList.remove("overflow-hidden");
      }
    };

    const app = document.getElementById("app") as HTMLElement;
    app.classList.add("overflow-hidden");
    const newUrl = `/inmueble/1`;
    const newTitle = "property.title";
    const newState = { page: "property.id" };
    window.history.pushState(newState, newTitle, newUrl);

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setPropertyId, propertyId, show, hide]);

  return (
    <PropertiesGrid>
      {properties?.map((property) => {
        return (
          <PropertyItem
            key={property.id}
            userEmail={userEmail}
            property={property}
          />
        );
      })}
      <PropertiesList userEmail={userEmail} />
    </PropertiesGrid>
  );
}
