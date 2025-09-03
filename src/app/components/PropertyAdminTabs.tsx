"use client";

import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getFieldFromTable } from "@/lib/getFieldFromTable";
import TabLink from "./TabLink";
import TabLinks from "./TabLinks";

export default function PropertyAdminTabs() {
  const params = useParams();
  const pathname = usePathname();
  const propertyId = params.id as string;

  const [transactionType, setTransactionType] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactionType() {
      if (!propertyId || Array.isArray(propertyId)) {
        return;
      }

      const type = await getFieldFromTable<string>(
        "property",
        propertyId,
        "transaction_type"
      );

      setTransactionType(type);
    }

    fetchTransactionType();
  }, [propertyId]);

  if (transactionType === null) {
    return null;
  }

  const tabs = [
    {
      title: "General",
      href: `/admin/property/edit/${propertyId}`,
    },
    {
      title: "Imagenes",
      href: `/admin/property/edit/${propertyId}/images`,
    },
  ];

  if (transactionType === "venta") {
    tabs.push({
      title: "Tipologias",
      href: `/admin/property/edit/${propertyId}/typologies`,
    });
  }

  return (
    <TabLinks>
      {tabs.map((tab) => (
        <TabLink
          key={tab.href}
          href={tab.href}
          title={tab.title}
          isActive={pathname === tab.href}
        />
      ))}
    </TabLinks>
  );
}
