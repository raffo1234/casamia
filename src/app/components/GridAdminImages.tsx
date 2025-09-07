import React from "react";

export default function GridAdminImages({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className="grid gap-6"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {children}
    </section>
  );
}
