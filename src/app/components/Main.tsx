export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-14">
      {children}
    </main>
  );
}
