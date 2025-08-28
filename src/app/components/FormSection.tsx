export default function FormSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex p-7 flex-col gap-4 border border-gray-100 rounded-xl bg-white">
      {children}
    </div>
  );
}
