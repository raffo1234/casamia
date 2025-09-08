export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="py-[100px]">{children}</div>;
}
