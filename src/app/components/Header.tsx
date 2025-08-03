import ProfilePopover from "@/components/ProfilePopover";
import Logo from "@/components/Logo";
import HightLightSelect from "./HighLightSelect";

export default function Header() {
  return (
    <header className="w-full mb-12">
      <nav className="max-w-[1816px] w-full mx-auto p-4 justify-between flex items-center">
        <Logo />
        <div className="flex items-center gap-4">
          <HightLightSelect />
          <ProfilePopover />
        </div>
      </nav>
    </header>
  );
}
