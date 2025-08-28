export default function FormInputLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <label htmlFor={htmlFor} className="inline-block mb-2 text-sm">
      {children}
    </label>
  );
}
