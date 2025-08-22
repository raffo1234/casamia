"use client";

import { useParams, usePathname } from "next/navigation";
import TabLink from "./TabLink";
import TabLinks from "./TabLinks";

const getTabs = (propertyId: string) => [
  {
    title: "General",
    href: `/admin/property/edit/${propertyId}`,
  },
  {
    title: "Imagenes",
    href: `/admin/property/edit/${propertyId}/images`,
  },
  {
    title: "Tipologias",
    href: `/admin/property/edit/${propertyId}/typologies`,
  },
];

export default function PropertyAdminTabs() {
  const params = useParams();
  const pathname = usePathname();
  const tabs = getTabs(params.id as string);

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
