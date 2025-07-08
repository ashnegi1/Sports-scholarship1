import { toast } from "Sonner";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Apply from "./pages/Apply";
import Download from "./pages/Download";
import SimpleAdminDashboard from "./pages/SimpleAdminDashboard";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./lib/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import SignInPage from "./pages/SignInPage"; // 🔥 NEW
import AdminDebug from "./pages/AdminDebug"; // Admin role debug page

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-xl">Loading...</p>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/download" element={<Download />} />
              <Route path="/admin-debug" element={<AdminDebug />} />

              {/* Protected Routes (User) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/apply" element={<Apply />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

              {/* Protected Routes (Admin) */}
              <Route element={<ProtectedRoute requireAdmin />}>
                <Route
                  path="/admin"
                  element={
                    <ErrorBoundary fallback={<SimpleAdminDashboard />}>
                      <Suspense fallback={<Loading />}>
                        <AdminDashboard />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route path="/admin/simple" element={<SimpleAdminDashboard />} />
              </Route>

              {/* Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
