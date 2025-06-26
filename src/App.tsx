import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

// Lazy load the complex admin dashboard component
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// Simple loading component
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
              <Route path="/apply" element={<Apply />} />
              <Route path="/download" element={<Download />} />
              
              {/* User Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              
              {/* Admin Protected Routes */}
              <Route element={<ProtectedRoute requireAdmin />}>
                {/* Use Suspense and ErrorBoundary for AdminDashboard */}
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
                
                {/* Fallback admin route in case the main one fails */}
                <Route path="/admin/simple" element={<SimpleAdminDashboard />} />
              </Route>
              
              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
