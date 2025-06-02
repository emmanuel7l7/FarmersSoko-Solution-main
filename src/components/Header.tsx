
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X, ShoppingCart, User, Package } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // TODO: Replace with actual authentication state
  const isAuthenticated = false;
  const userType = "customer"; // or "farmer"

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
            
            {isAuthenticated ? (
              <>
                {userType === "farmer" ? (
                  <>
                    <Link to="/farmer/dashboard" className="text-gray-600 hover:text-green-600 transition-colors flex items-center">
                      <Package className="h-4 w-4 mr-1" />
                      Dashboard
                    </Link>
                    <Link to="/farmer/products" className="text-gray-600 hover:text-green-600 transition-colors">
                      My Products
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/cart" className="text-gray-600 hover:text-green-600 transition-colors flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Cart
                    </Link>
                  </>
                )}
                <Button variant="ghost" className="text-gray-600 hover:text-green-600">
                  <User className="h-4 w-4 mr-1" />
                  Profile
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-green-600 transition-colors">
                  Login
                </Link>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
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
              
              {isAuthenticated ? (
                <>
                  {userType === "farmer" ? (
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
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/cart" 
                        className="text-gray-600 hover:text-green-600 transition-colors px-2 py-1 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Cart
                      </Link>
                    </>
                  )}
                  <button className="text-gray-600 hover:text-green-600 transition-colors px-2 py-1 text-left flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-green-600 transition-colors px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
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
