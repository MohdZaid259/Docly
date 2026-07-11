import { Moon, Sun, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const initials = (name) =>
  (name || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your account and preferences.</p>
        </div>

        <Card className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Account</h2>
          <div className="mt-4 flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarImage src={user?.picture} alt={user?.name} />
              <AvatarFallback className="text-lg">{initials(user?.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{user?.name}</p>
              <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Preferences</h2>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">Theme</p>
              <p className="text-sm text-muted-foreground">Switch between light and dark mode.</p>
            </div>
            <Button variant="outline" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Session</h2>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">Sign out</p>
              <p className="text-sm text-muted-foreground">You'll need to sign in again to access your documents.</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
