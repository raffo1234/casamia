import { auth } from "@/lib/auth";
import { Suspense, use } from "react";

export default function Page() {
  const session = use(auth());
  const userEmail = session?.user?.email;
  console.log(userEmail);
  return (
    <Suspense>
      <div>
        <h1>Images 111</h1>
      </div>
    </Suspense>
  );
}
