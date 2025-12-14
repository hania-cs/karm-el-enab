import { Link } from "react-router-dom";
import { Grape } from "lucide-react";
import logo from "/logo.png"; // Your logo image

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
                <Link to="/" className="flex items-center">
                     <img
                       src={logo}
                       alt="Karm Enab Logo"
                       className="h-20 w-auto object-contain" // Bigger logo, auto width
                     />
                   </Link>
            <p className="text-sm text-muted-foreground">
              Modern equipment rental and farm management for the modern farmer.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-foreground transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Equipment Rental</li>
              <li>Farm Management</li>
              <li>Plot Tracking</li>
              <li>Resource Library</li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@farmrent.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FarmRent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
