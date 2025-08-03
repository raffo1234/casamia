export default function PropertiesGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className="grid gap-10"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      }}
    >
      {children}
    </section>
  );
}
