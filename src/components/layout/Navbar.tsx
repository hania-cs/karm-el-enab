import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import logo from "/logo.png"; // Your logo image

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  User,
  LogOut,
  LayoutDashboard,
  Tractor,
  LandPlot,
  FileText,
  Users,
  ClipboardList,
  Book,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, role, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const publicLinks = [{ href: "/", label: "Home", icon: Book }];

  const farmerLinks = [
    { href: "/farmer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/farmer/plots", label: "My Plots", icon: LandPlot },
    { href: "/farmer/equipment", label: "Equipment", icon: Tractor },
    { href: "/farmer/rentals", label: "My Rentals", icon: ClipboardList },
  ];

  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/equipment", label: "Equipment", icon: Tractor },
    { href: "/admin/rentals", label: "Rentals", icon: ClipboardList },
    { href: "/admin/plots", label: "Plots", icon: LandPlot },
    { href: "/admin/booklets", label: "Booklets", icon: FileText },
    { href: "/admin/support", label: "Support", icon: MessageSquare },
  ];

  const navLinks = isAuthenticated
    ? role === "admin"
      ? adminLinks
      : farmerLinks
    : publicLinks;

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navLinks.map((link) => {
        const isActive = location.pathname === link.href;
        return (
          <Link
            key={link.href}
            to={link.href}
            onClick={() => mobile && setMobileOpen(false)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              mobile ? "w-full" : "",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between"> {/* Navbar taller for bigger logo */}
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Karm Enab Logo"
            className="h-16 w-auto object-contain" // Bigger logo, auto width
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLinks />
        </nav>

        {/* Auth buttons & mobile menu */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem disabled className="text-muted-foreground">
                  {role === "admin" ? "Administrator" : "Farmer"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 mt-8">
                <NavLinks mobile />
                {!isAuthenticated && (
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" asChild onClick={() => setMobileOpen(false)}>
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button asChild onClick={() => setMobileOpen(false)}>
                      <Link to="/register">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
