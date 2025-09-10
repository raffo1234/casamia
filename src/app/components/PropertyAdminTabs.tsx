"use client";

import { useParams, usePathname } from "next/navigation";
import useSWR from "swr";
import { getFieldFromTable } from "@/lib/getFieldFromTable";
import TabLink from "./TabLink";
import TabLinks from "./TabLinks";

export default function PropertyAdminTabs() {
  const params = useParams();
  const pathname = usePathname();
  const propertyId = params.id as string;

  const swrKey = propertyId
    ? ["property", propertyId, "transaction_type"]
    : null;

  const fetcher = async ([tableName, id, columnName]: string[]) => {
    return getFieldFromTable(tableName, "id", columnName, id);
  };

  const { data: transactionType } = useSWR(swrKey, fetcher);

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
