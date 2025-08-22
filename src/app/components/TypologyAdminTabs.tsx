"use client";

import { useParams, usePathname } from "next/navigation";
import TabLink from "./TabLink";
import TabLinks from "./TabLinks";

const getTabs = (propertyId: string, typologyId: string) => [
  {
    title: "General",
    href: `/admin/property/edit/${propertyId}/typologies/edit/${typologyId}`,
  },
  {
    title: "Imagenes",
    href: `/admin/property/edit/${propertyId}/typologies/edit/${typologyId}/images`,
  },
];

export default function TipologyAdminTabs() {
  const params = useParams();
  const pathname = usePathname();
  const tabs = getTabs(params.id as string, params.typologyId as string);

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
