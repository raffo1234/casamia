export default function FormFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <footer className="flex items-center gap-4 pt-4 mt-4 justify-end">
      {children}
    </footer>
  );
}
