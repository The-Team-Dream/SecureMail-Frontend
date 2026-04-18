import { Bell } from "lucide-react";
import Logo from "../../shared/Logo";
import { Text } from "../../shared/Text";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./MobileSidebar";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-6 px-4.5 bg-background sticky top-0 z-50 shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2">
        <MobileSidebar />
        <Logo width={40} height={40} />
      </div>
      <div className="flex items-center gap-4">
        <Button size={"icon-sm"} variant={"ghost"} className="relative">
          <Bell className="w-6 h-6 text-primary-500" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-error-700 rounded-full border-2 border-white"></span>
        </Button>

        <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center border border-secondary-900 cursor-pointer">
          <Text color={"secondary-900"} font={"medium"}>
            MH
          </Text>
        </div>
      </div>
    </nav>
  );
};
