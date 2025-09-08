import React from "react";

export default function HomeContainer({
  children,
  Element = "section",
}: {
  children: React.ReactNode;
  Element?: React.ElementType;
}) {
  return (
    <Element className="max-w-[1816px] px-4 w-full mx-auto">{children}</Element>
  );
}
