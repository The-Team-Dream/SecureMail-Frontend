import { Navbar } from "@/_components/dashboard/layout/Navbar";
import { Sidebar } from "@/_components/dashboard/layout/Sidebar";
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="pl-6 py-4 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
