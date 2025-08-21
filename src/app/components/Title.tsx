export default function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-flaviotte text-3xl mb-10 font-semibold block tracking-wider">
      {children}
    </h1>
  );
}
