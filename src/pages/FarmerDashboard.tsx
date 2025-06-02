
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package, DollarSign, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FarmerDashboard = () => {
  const stats = [
    { icon: <Package className="h-6 w-6" />, label: "Total Products", value: "12", color: "text-blue-600" },
    { icon: <DollarSign className="h-6 w-6" />, label: "Monthly Revenue", value: "TSh 450,000", color: "text-green-600" },
    { icon: <Users className="h-6 w-6" />, label: "Customers", value: "38", color: "text-purple-600" },
    { icon: <TrendingUp className="h-6 w-6" />, label: "Orders", value: "24", color: "text-orange-600" }
  ];

  const recentProducts = [
    { id: 1, name: "Fresh Tomatoes", price: "TSh 3,000/kg", stock: 50, status: "active" },
    { id: 2, name: "Organic Carrots", price: "TSh 2,500/kg", stock: 30, status: "active" },
    { id: 3, name: "Green Beans", price: "TSh 4,000/kg", stock: 0, status: "out_of_stock" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
            <p className="text-gray-600">Welcome back, manage your farm business</p>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link to="/farmer/products/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>Your latest listed products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Stock: {product.stock}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'active' ? 'Active' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link to="/farmer/products">View All Products</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your farm business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/farmer/products">
                  <Package className="h-4 w-4 mr-2" />
                  Manage Products
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/farmer/orders">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Orders
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/farmer/profile">
                  <Users className="h-4 w-4 mr-2" />
                  Update Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FarmerDashboard;
