import ProfilePopover from "@/components/ProfilePopover";
import Logo from "@/components/Logo";

export default function Header() {
  return (
    <header className="w-full mb-12">
      <nav className="max-w-[1816px] w-full mx-auto p-4 justify-between flex items-center">
        <Logo />
        <ProfilePopover />
      </nav>
    </header>
  );
}
