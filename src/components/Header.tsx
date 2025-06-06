import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X, ShoppingCart, User, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState("customer");
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      
      if (user) {
        console.log('Current user:', user);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
        }
        
        if (profile) {
          console.log('User role:', profile.role);
          setUserType(profile.role);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user);
      setIsAuthenticated(!!session?.user);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error('Error fetching profile on auth change:', error);
            }
            if (profile) {
              console.log('User role on auth change:', profile.role);
              setUserType(profile.role);
            }
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Add debug logging for render
  console.log('Current state:', { isAuthenticated, userType });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-green-600 p-2 rounded-full">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FarmersSoko</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/marketplace" className="text-gray-600 hover:text-green-600 transition-colors">
              Marketplace
            </Link>
            
            {isAuthenticated && userType === "admin" ? (
              <Link to="/admin/dashboard" className="text-gray-600 hover:text-green-600 transition-colors flex items-center">
                <Package className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            ) : isAuthenticated && (
              <>
                {userType === "farmer" && (
                  <>
                    <Link to="/farmer/dashboard" className="text-gray-600 hover:text-green-600 transition-colors flex items-center">
                      <Package className="h-4 w-4 mr-1" />
                      Dashboard
                    </Link>
                    <Link to="/farmer/products" className="text-gray-600 hover:text-green-600 transition-colors">
                      My Products
                    </Link>
                    <Link to="/profile" className="text-gray-600 hover:text-green-600 transition-colors flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Profile
                    </Link>
                  </>
                )}
                {userType === "customer" && (
                  <>
                    <Link to="/cart" className="text-gray-600 hover:text-green-600 transition-colors flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Cart
                    </Link>
                    <Link to="/profile" className="text-gray-600 hover:text-green-600 transition-colors flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Profile
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/marketplace" 
                className="text-gray-600 hover:text-green-600 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              
              {isAuthenticated && userType === "admin" ? (
                <Link 
                  to="/admin/dashboard" 
                  className="text-gray-600 hover:text-green-600 transition-colors px-2 py-1 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              ) : isAuthenticated && (
                <>
                  {userType === "farmer" && (
                    <>
                      <Link 
                        to="/farmer/dashboard" 
                        className="text-gray-600 hover:text-green-600 transition-colors px-2 py-1 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                      <Link 
                        to="/farmer/products" 
                        className="text-gray-600 hover:text-green-600 transition-colors px-2 py-1"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Products
                      </Link>
                      <Link 
                        to="/profile" 
                        className="text-gray-600 hover:text-green-600 transition-colors px-2 py-1 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </>
                  )}
                  {userType === "customer" && (
                    <>
                      <Link 
                        to="/cart" 
                        className="text-gray-600 hover:text-green-600 transition-colors px-2 py-1 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Cart
                      </Link>
                      <Link 
                        to="/profile" 
                        className="text-gray-600 hover:text-green-600 transition-colors px-2 py-1 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
