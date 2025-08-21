export default function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-gilroy-medium text-4xl font-semibold block">
      {children}
    </h1>
  );
}
