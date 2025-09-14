export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="py-[40px]">{children}</div>;
}
