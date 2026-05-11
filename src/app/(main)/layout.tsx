import { Navbar } from "@/_components/shared/Navbar";
import { Sidebar } from "@/_components/shared/Sidebar";
import { ComposeEmailSheet } from "@/_components/mailbox/SendEmailSheet";
import { SocketProvider } from "@/utils/providers/SocketProvider";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SocketProvider>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
        </div>
        <ComposeEmailSheet />
      </div>
    </SocketProvider>
  );
};

export default MainLayout;
