import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, ShoppingCart, TrendingUp, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Direct Connection",
      description: "Connect farmers directly with customers, eliminating middlemen"
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-green-600" />,
      title: "Easy Shopping",
      description: "Browse fresh produce by categories with transparent pricing"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Fair Pricing",
      description: "Farmers set their own prices and customers get competitive rates"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Secure Payments",
      description: "Safe and secure mobile payment integration"
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "Fast Delivery",
      description: "Quick delivery service managed through our platform"
    },
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: "Fresh Produce",
      description: "Get the freshest fruits, vegetables, grains and more"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{" "}
              <span className="text-green-600">FarmersSoko</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connecting farmers directly with customers. Fresh produce, fair prices, 
              no middlemen. Join the agricultural revolution today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link to="/register/farmer">Join as Farmer</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                <Link to="/register/customer">Shop as Customer</Link>
              </Button>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" 
                alt="Fresh farm produce" 
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-green-600/10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose FarmersSoko?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're revolutionizing agriculture by creating direct connections between farmers and customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-green-100 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-green-50 rounded-full w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories Preview */}
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fresh Categories
            </h2>
            <p className="text-xl text-gray-600">
              Explore our wide range of fresh agricultural products
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Fruits", emoji: "🍎", color: "bg-red-100" },
              { name: "Vegetables", emoji: "🥬", color: "bg-green-100" },
              { name: "Grains", emoji: "🌾", color: "bg-yellow-100" },
              { name: "Meat & Eggs", emoji: "🥚", color: "bg-orange-100" }
            ].map((category, index) => (
              <Card key={index} className={`${category.color} border-none hover:scale-105 transition-transform duration-300 cursor-pointer`}>
                <CardContent className="text-center p-6">
                  <div className="text-4xl mb-2">{category.emoji}</div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-green-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of farmers and customers already using FarmersSoko
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600">
              <Link to="/register">Register Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
