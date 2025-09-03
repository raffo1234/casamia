import EditTypologyImages from "@/components/EditTypologyImages";
import { Suspense } from "react";

export default async function Page() {
  return (
    <Suspense>
      <EditTypologyImages />
    </Suspense>
  );
}
