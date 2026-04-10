import { Bell } from "lucide-react";
import Logo from "../shared/Logo";
import { Text } from "../shared/Text";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-6 px-4.5 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]">
      <Logo width={40} height={40} />
      {/* Profile and action */}
      <div className="flex items-center gap-4">
        <button className="rounded-full relative cursor-pointer hover:bg-primary-100 p-2">
          <Bell className="w-6 h-6 text-primary-500" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error-700 rounded-full border-2 border-white"></span>
        </button>

        <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center border border-secondary-900 cursor-pointer">
          <Text color={"secondary-900"} font={"medium"}>
            MH
          </Text>
        </div>
      </div>
    </nav>
  );
};
