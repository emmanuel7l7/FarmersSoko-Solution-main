import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShoppingCart, Filter, MapPin, Star, ChevronRight } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = [
    { id: "all", name: "All Products", emoji: "🌿", image: "/categories/all.jpg" },
    { id: "Fruits", name: "Fruits", emoji: "🍎", image: "/categories/fruits.jpg" },
    { id: "Vegetables", name: "Vegetables", emoji: "🥬", image: "/categories/vegetables.jpg" },
    { id: "Grains", name: "Grains", emoji: "🌾", image: "/categories/grains.jpg" },
    { id: "Meat & Eggs", name: "Meat & Eggs", emoji: "🥚", image: "/categories/meat.jpg" },
    { id: "Dairy", name: "Dairy", emoji: "🥛", image: "/categories/dairy.jpg" },
    { id: "Herbs & Spices", name: "Herbs & Spices", emoji: "🌿", image: "/categories/herbs.jpg" }
  ];

  // Fetch products from Supabase
  const fetchProducts = async (category = "all") => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          farmers (
            id,
            first_name,
            last_name,
            location
          )
        `);

      if (category !== "all") {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      console.log('Fetched products:', data); // Debug log
      setProducts(data || []);
      
      // Initialize quantities for new products
      const newQuantities = {};
      data?.forEach(product => {
        if (!quantities[product.id]) {
          newQuantities[product.id] = 1;
        }
      });
      setQuantities(prev => ({ ...prev, ...newQuantities }));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    console.log('Selected category:', categoryId); // Debug log
    setSelectedCategory(categoryId);
    fetchProducts(categoryId);
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, parseInt(value) || 1)
    }));
  };

  const addToCart = async (product) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to add items to your cart.",
          variant: "destructive",
        });
        return;
      }

      console.log('Adding to cart:', {
        userId: user.id,
        productId: product.id,
        quantity: quantities[product.id] || 1,
        price: product.price
      });

      const quantity = quantities[product.id] || 1;
      
      // Check if product is already in cart
      const { data: existingItem, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();

      console.log('Existing cart item check:', { existingItem, checkError });

      if (existingItem) {
        // Update quantity if item exists
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) {
          console.error('Error updating cart item:', error);
          throw error;
        }
      } else {
        // Add new item to cart
        const { error } = await supabase
          .from('cart_items')
          .insert([
            {
              user_id: user.id,
              product_id: product.id,
              quantity: quantity,
              price: product.price
            }
          ]);

        if (error) {
          console.error('Error inserting cart item:', error);
          throw error;
        }
      }

      toast({
        title: "Success",
        description: "Product added to cart!",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    const farmerName = product.farmers 
      ? `${product.farmers.first_name} ${product.farmers.last_name}`.toLowerCase()
      : 'Unknown Farmer';
    
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmerName.includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Load products when component mounts
  useEffect(() => {
    fetchProducts(selectedCategory);
  }, []);

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedCategory === category.id ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square relative mb-3 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="object-cover w-full h-full"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://ui-avatars.com/api/?name=${category.name}&background=random`;
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-2xl">{category.emoji}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-square relative mb-3 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="object-cover w-full h-full"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://ui-avatars.com/api/?name=${product.name}&background=random`;
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-sm text-yellow-600">
                      <Star className="h-3 w-3 fill-current mr-1" />
                      {product.rating || 'New'}
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      {product.farmers 
                        ? `${product.farmers.first_name} ${product.farmers.last_name} • ${product.farmers.location}`
                        : 'Farmer information not available'}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">
                        TSh {product.price}
                      </span>
                      <span className="text-sm text-gray-600">per {product.unit}</span>
                    </div>
                    
                    {product.quantity_available > 0 ? (
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Select
                            value={quantities[product.id]?.toString()}
                            onValueChange={(value) => handleQuantityChange(product.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Qty" />
                            </SelectTrigger>
                            <SelectContent>
                              {[...Array(Math.min(10, product.quantity_available))].map((_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => addToCart(product)}
                          disabled={product.quantity_available === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
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
        )}

        {!loading && filteredProducts.length === 0 && (
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
