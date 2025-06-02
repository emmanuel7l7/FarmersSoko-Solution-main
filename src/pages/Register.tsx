
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-600 p-3 rounded-full">
                <Leaf className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join FarmersSoko Today
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose how you want to participate in our agricultural marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Farmer Registration */}
            <Card className="border-green-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
                  <Leaf className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-2">Join as Farmer</CardTitle>
                <CardDescription className="text-gray-600">
                  Sell your fresh produce directly to customers and grow your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>List and manage your produce</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Set your own prices</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Reach customers directly</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Monthly subscription: TSh 12,000/month</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700 mt-6">
                  <Link to="/register/farmer">Register as Farmer</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Customer Registration */}
            <Card className="border-blue-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                  <ShoppingCart className="h-12 w-12 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-2">Join as Customer</CardTitle>
                <CardDescription className="text-gray-600">
                  Buy fresh produce directly from farmers at fair prices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Browse fresh produce</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Direct farmer prices</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Optional delivery service</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Free to join</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 mt-6">
                  <Link to="/register/customer">Register as Customer</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
