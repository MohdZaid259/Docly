import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, Upload, LogOut, User, CreditCard } from "lucide-react";
import { toast } from "sonner";

import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { getDocuments, uploadDocument } from "@/api/doc.api";
import { isAllowedFile, ACCEPT_ATTRIBUTE } from "@/helpers/fileValidation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SidebarNav, SidebarBrand } from "@/components/shell/Sidebar";
import UploadForm from "@/components/UploadForm";

const initials = (name) =>
  (name || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const Topbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [hasDocuments, setHasDocuments] = useState(true);
  const [quickUploading, setQuickUploading] = useState(false);
  const quickUploadRef = useRef(null);

  useEffect(() => {
    getDocuments()
      .then((res) => setHasDocuments(res.data.length > 0))
      .catch(() => setHasDocuments(true));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUploadClick = () => {
    if (!hasDocuments) {
      quickUploadRef.current?.click();
      return;
    }
    setUploadOpen(true);
  };

  const handleQuickUpload = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    if (!isAllowedFile(file)) {
      toast.error("Only PDF, DOCX, and TXT files are allowed.");
      return;
    }

    try {
      setQuickUploading(true);
      const formData = new FormData();
      formData.append("document", file);
      await uploadDocument(formData);
      toast.success("Document uploaded successfully");
      setHasDocuments(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setQuickUploading(false);
    }
  };

  return (
    <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="size-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleUploadClick} disabled={quickUploading}>
          <Upload className="size-4" />
          <span className="hidden sm:inline">{quickUploading ? "Uploading..." : "Upload"}</span>
        </Button>
        <input
          ref={quickUploadRef}
          type="file"
          className="hidden"
          accept={ACCEPT_ATTRIBUTE}
          onChange={handleQuickUpload}
        />

        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
              <Avatar>
                <AvatarImage src={user?.picture} alt={user?.name} />
                <AvatarFallback>{initials(user?.name)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="truncate text-sm font-medium text-foreground">{user?.name}</span>
              <span className="truncate text-xs font-normal text-muted-foreground">{user?.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <User className="size-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/billing">
                <CreditCard className="size-4" />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-64">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarBrand />
          <div onClick={() => setMobileNavOpen(false)}>
            <SidebarNav />
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload a document</DialogTitle>
          </DialogHeader>
          <UploadForm hideTitle onUploaded={() => setUploadOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Topbar;
