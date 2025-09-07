export default function PropertiesAdminGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className="grid gap-8"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      }}
    >
      {children}
    </section>
  );
}
