import { Outlet } from "react-router-dom";

import { Sidebar } from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";

const AppShell = () => (
  <div className="flex min-h-screen bg-background text-foreground">
    <Sidebar />
    <div className="flex min-w-0 flex-1 flex-col">
      <Topbar />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AppShell;
