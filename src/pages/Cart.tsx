import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, ShoppingCart, Package, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [includeDelivery, setIncludeDelivery] = useState(false);
  const { toast } = useToast();

  const fetchCartItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        throw new Error("Not authenticated");
      }

      console.log('Fetching cart items for user:', user.id);

      // First, let's check if we can fetch the cart items
      const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (cartError) {
        console.error('Error fetching basic cart items:', cartError);
        throw cartError;
      }

      console.log('Basic cart items:', cartData);

      // Now fetch with the full product details
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          price,
          created_at,
          updated_at,
          products!inner (
            id,
            name,
            price,
            image_url,
            unit,
            quantity_available,
            farmers!inner (
              first_name,
              last_name,
              location
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching cart items with details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Fetched cart items with details:', data);
      
      // Transform the data to match our expected structure
      const transformedData = data?.map(item => ({
        ...item,
        products: item.products,
        quantity: item.quantity
      })) || [];

      console.log('Transformed cart items:', transformedData);
      setCartItems(transformedData);
    } catch (error) {
      console.error('Error in fetchCartItems:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      toast({
        title: "Error",
        description: "Failed to load cart items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;
      fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (itemId) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      fetchCartItems();
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.products.price * item.quantity);
    }, 0);
  };

  const calculateDeliveryCost = () => {
    // Base delivery cost
    const baseCost = 5000;
    // Additional cost per item
    const perItemCost = 1000;
    return baseCost + (cartItems.length * perItemCost);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryCost = includeDelivery ? calculateDeliveryCost() : 0;
    return subtotal + deliveryCost;
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">Review your items and proceed to checkout</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/marketplace">
              Continue Shopping
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some products to your cart to continue shopping</p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link to="/marketplace">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = `https://ui-avatars.com/api/?name=${item.products.name}&background=random`;
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{item.products.name}</h3>
                            <p className="text-sm text-gray-600">
                              By {item.products.farmers.first_name} {item.products.farmers.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{item.products.farmers.location}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Select
                              value={item.quantity.toString()}
                              onValueChange={(value) => updateQuantity(item.id, parseInt(value))}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[...Array(Math.min(10, item.products.quantity_available))].map((_, i) => (
                                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    {i + 1}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span className="text-sm text-gray-600">{item.products.unit}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">
                              TSh {item.products.price * item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              TSh {item.products.price} per {item.products.unit}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review your order details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>TSh {calculateSubtotal()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="delivery"
                        checked={includeDelivery}
                        onCheckedChange={(checked) => setIncludeDelivery(checked as boolean)}
                      />
                      <label htmlFor="delivery" className="text-sm">
                        Include Delivery (TSh {calculateDeliveryCost()})
                      </label>
                    </div>
                    {includeDelivery && (
                      <div className="text-sm text-gray-600">
                        <p>Delivery includes:</p>
                        <ul className="list-disc list-inside">
                          <li>Base delivery fee: TSh 5,000</li>
                          <li>Additional TSh 1,000 per item</li>
                        </ul>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span className="text-green-600">TSh {calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
