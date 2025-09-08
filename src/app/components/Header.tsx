import ProfilePopover from "@/components/ProfilePopover";
import Logo from "@/components/Logo";
import HightLightSelect from "./HighLightSelect";
import { Suspense } from "react";
import HomeContainer from "./HomeContainer";

export default function Header() {
  return (
    <HomeContainer Element="header">
      <nav className="justify-between py-4 flex items-center">
        <Logo />
        <div className="flex items-center gap-4">
          <HightLightSelect />
          <Suspense>
            <ProfilePopover />
          </Suspense>
        </div>
      </nav>
    </HomeContainer>
  );
}
