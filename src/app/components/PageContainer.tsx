export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="py-[50px]">{children}</div>;
}
