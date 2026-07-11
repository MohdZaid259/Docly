import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, MessagesSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/documents", label: "Documents", icon: FileText, end: false },
  { to: "/global-chat", label: "Global Chat", icon: MessagesSquare, end: false },
];

const SidebarNav = () => (
  <nav className="flex flex-col gap-1">
    {navItems.map(({ to, label, icon: Icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )
        }
      >
        <Icon className="size-4" />
        {label}
      </NavLink>
    ))}
  </nav>
);

const SidebarBrand = () => (
  <div className="flex items-center gap-2 px-1">
    <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-bold text-white">
      D
    </div>
    <span className="text-lg font-semibold tracking-tight">Docly</span>
  </div>
);

const Sidebar = () => (
  <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-border bg-card/50 p-4 lg:flex">
    <SidebarBrand />
    <SidebarNav />
  </aside>
);

export { Sidebar, SidebarNav, SidebarBrand };
