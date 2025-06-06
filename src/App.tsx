import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Register from "./pages/Register";
import FarmerRegister from "./pages/FarmerRegister";
import CustomerRegister from "./pages/CustomerRegister";
import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerProducts from "./pages/FarmerProducts";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Marketplace from "./pages/Marketplace";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerProfile from "./pages/CustomerProfile";

const queryClient = new QueryClient();

// Check if Supabase is configured
const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

const App = () => {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-600 mb-4">
            Supabase configuration is missing. Please make sure you have set up your .env file with:
          </p>
          <pre className="bg-gray-100 p-4 rounded-md text-sm">
            VITE_SUPABASE_URL=your_project_url{'\n'}
            VITE_SUPABASE_ANON_KEY=your_anon_key{'\n'}
            VITE_ADMIN_EMAIL=your_admin_email
          </pre>
          <p className="text-gray-600 mt-4">
            After adding these variables, please restart your development server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/farmer" element={<FarmerRegister />} />
              <Route path="/register/customer" element={<CustomerRegister />} />
              <Route path="/login" element={<Login />} />
              
              {/* Farmer Routes */}
              <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
              <Route path="/farmer/products" element={<FarmerProducts />} />
              <Route path="/farmer/products/add" element={<AddProduct />} />
              <Route path="/farmer/products/edit/:id" element={<EditProduct />} />
              
              {/* Customer Routes */}
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<CustomerProfile />} />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
