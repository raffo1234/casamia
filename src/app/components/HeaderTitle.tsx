export default function HeaderTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <header className="w-full mb-10 flex justify-between">{children}</header>
  );
}
