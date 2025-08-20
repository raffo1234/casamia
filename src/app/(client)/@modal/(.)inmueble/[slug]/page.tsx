import PropertyPreview from "@/components/PropertyPreview";
import { auth } from "@/lib/auth";
import { Suspense, use } from "react";

export default function Page() {
  const session = use(auth());
  const userEmail = session?.user?.email;

  return (
    <Suspense>
      <PropertyPreview userEmail={userEmail} />
    </Suspense>
  );
}
