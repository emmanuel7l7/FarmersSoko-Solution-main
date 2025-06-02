
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Filter, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Products", emoji: "🌿" },
    { id: "fruits", name: "Fruits", emoji: "🍎" },
    { id: "vegetables", name: "Vegetables", emoji: "🥬" },
    { id: "grains", name: "Grains", emoji: "🌾" },
    { id: "meat", name: "Meat & Eggs", emoji: "🥚" }
  ];

  const products = [
    { id: 1, name: "Fresh Tomatoes", farmer: "John's Farm", location: "Arusha", price: "TSh 3,000", unit: "kg", rating: 4.8, image: "🍅", category: "vegetables", inStock: true },
    { id: 2, name: "Organic Carrots", farmer: "Green Valley Farm", location: "Moshi", price: "TSh 2,500", unit: "kg", rating: 4.9, image: "🥕", category: "vegetables", inStock: true },
    { id: 3, name: "Fresh Mangoes", farmer: "Tropical Fruits Co", location: "Dar es Salaam", price: "TSh 1,500", unit: "kg", rating: 4.7, image: "🥭", category: "fruits", inStock: true },
    { id: 4, name: "Sweet Bananas", farmer: "Mountain Farm", location: "Kilimanjaro", price: "TSh 1,000", unit: "bunch", rating: 4.6, image: "🍌", category: "fruits", inStock: true },
    { id: 5, name: "White Rice", farmer: "Rice Valley", location: "Morogoro", price: "TSh 2,800", unit: "kg", rating: 4.8, image: "🌾", category: "grains", inStock: true },
    { id: 6, name: "Free Range Eggs", farmer: "Happy Chickens Farm", location: "Dodoma", price: "TSh 500", unit: "piece", rating: 4.9, image: "🥚", category: "meat", inStock: false }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fresh Marketplace</h1>
          <p className="text-gray-600">Buy fresh produce directly from local farmers</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for products or farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap ${
                  selectedCategory === category.id 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "hover:bg-green-50"
                }`}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-4xl">{product.image}</div>
                  <div className="flex items-center text-sm text-yellow-600">
                    <Star className="h-3 w-3 fill-current mr-1" />
                    {product.rating}
                  </div>
                </div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="space-y-1">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {product.farmer} • {product.location}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">
                      {product.price}
                    </span>
                    <span className="text-sm text-gray-600">per {product.unit}</span>
                  </div>
                  
                  {product.inStock ? (
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  ) : (
                    <Button disabled className="w-full">
                      Out of Stock
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or browse different categories</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Marketplace;
