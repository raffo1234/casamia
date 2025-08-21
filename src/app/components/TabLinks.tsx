
export default function TabLinks({ children }: { children: React.ReactNode }) {
  return (
    <nav className="mb-10 flex gap-1">
     {children}
    </nav>
  );
}