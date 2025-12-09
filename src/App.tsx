import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookletPage from "./pages/BookletPage";
import NotFound from "./pages/NotFound";

// Farmer Pages
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import FarmerPlots from "./pages/farmer/FarmerPlots";
import FarmerEquipment from "./pages/farmer/FarmerEquipment";
import FarmerRentals from "./pages/farmer/FarmerRentals";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEquipment from "./pages/admin/AdminEquipment";
import AdminRentals from "./pages/admin/AdminRentals";
import AdminPlots from "./pages/admin/AdminPlots";
import AdminBooklets from "./pages/admin/AdminBooklets";
import AdminSupport from "./pages/admin/AdminSupport";

const queryClient = new QueryClient();

function AuthRedirect() {
  const { isAuthenticated, role, isLoading } = useAuth();
  
  if (isLoading) return null;
  
  if (isAuthenticated) {
    return <Navigate to={role === "admin" ? "/admin/dashboard" : "/farmer/dashboard"} replace />;
  }
  
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<><AuthRedirect /><LoginPage /></>} />
              <Route path="/register" element={<><AuthRedirect /><RegisterPage /></>} />
              <Route path="/booklet/:id" element={<BookletPage />} />

              {/* Farmer Routes */}
              <Route
                path="/farmer/dashboard"
                element={
                  <ProtectedRoute requiredRole="farmer">
                    <FarmerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/plots"
                element={
                  <ProtectedRoute requiredRole="farmer">
                    <FarmerPlots />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/equipment"
                element={
                  <ProtectedRoute requiredRole="farmer">
                    <FarmerEquipment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/rentals"
                element={
                  <ProtectedRoute requiredRole="farmer">
                    <FarmerRentals />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/equipment"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminEquipment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/rentals"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminRentals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/plots"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPlots />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/booklets"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminBooklets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/support"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminSupport />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
