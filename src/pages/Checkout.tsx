import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, CreditCard, Smartphone, Clock, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Checkout = () => {
  const [selectedPayment, setSelectedPayment] = useState("mpesa");
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    phone: "",
    notes: "",
    deliveryTime: "morning"
  });
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          price,
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

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setDeliveryInfo({
      ...deliveryInfo,
      [e.target.name]: e.target.value
    });
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
    const deliveryCost = calculateDeliveryCost();
    return subtotal + deliveryCost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total_amount: calculateTotal(),
            delivery_address: deliveryInfo.address,
            delivery_phone: deliveryInfo.phone,
            delivery_notes: deliveryInfo.notes,
            delivery_time: deliveryInfo.deliveryTime,
            payment_method: selectedPayment,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.products.id,
        quantity: item.quantity,
        price: item.products.price
      }));

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (orderItemsError) throw orderItemsError;

      // Clear cart
      const { error: clearCartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (clearCartError) throw clearCartError;

      toast({
        title: "Success",
        description: "Order placed successfully!",
      });

      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some products to your cart to continue shopping</p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link to="/marketplace">Browse Products</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order and arrange delivery</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Delivery Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-green-600" />
                    Delivery Information
                  </CardTitle>
                  <CardDescription>Where should we deliver your order?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter your full delivery address"
                      value={deliveryInfo.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={deliveryInfo.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryTime">Preferred Delivery Time</Label>
                    <select
                      id="deliveryTime"
                      name="deliveryTime"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      value={deliveryInfo.deliveryTime}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="morning">Morning (8AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 4PM)</option>
                      <option value="evening">Evening (4PM - 8PM)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any special instructions for delivery?"
                      value={deliveryInfo.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>How would you like to pay?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="mpesa"
                        name="payment"
                        value="mpesa"
                        checked={selectedPayment === "mpesa"}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="h-4 w-4 text-green-600"
                      />
                      <Label htmlFor="mpesa" className="flex items-center">
                        <Smartphone className="h-4 w-4 mr-2" />
                        M-PESA
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="cash"
                        name="payment"
                        value="cash"
                        checked={selectedPayment === "cash"}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="h-4 w-4 text-green-600"
                      />
                      <Label htmlFor="cash" className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Cash on Delivery
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>TSh {calculateDeliveryCost()}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>TSh {calculateTotal()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Order Items</h4>
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.products.name} x {item.quantity}
                          </span>
                          <span>TSh {item.products.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Place Order
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
