
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, CreditCard, Smartphone, Clock, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Checkout = () => {
  const [selectedPayment, setSelectedPayment] = useState("mpesa");
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    phone: "",
    notes: "",
    deliveryTime: "morning"
  });

  const orderItems = [
    { name: "Fresh Tomatoes", quantity: 2, price: 6000, farmer: "John's Farm" },
    { name: "Organic Carrots", quantity: 1, price: 2500, farmer: "Green Valley Farm" },
    { name: "Fresh Mangoes", quantity: 3, price: 4500, farmer: "Tropical Fruits Co" }
  ];

  const subtotal = 13000;
  const deliveryFee = 5000;
  const total = 18000;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setDeliveryInfo({
      ...deliveryInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", { deliveryInfo, selectedPayment, orderItems });
    // TODO: Implement order submission logic
  };

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
                      value={deliveryInfo.address}
                      onChange={handleInputChange}
                      placeholder="Enter your full delivery address..."
                      required
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={deliveryInfo.phone}
                      onChange={handleInputChange}
                      placeholder="e.g., +255 123 456 789"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryTime">Preferred Delivery Time</Label>
                    <select
                      id="deliveryTime"
                      name="deliveryTime"
                      value={deliveryInfo.deliveryTime}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="morning">Morning (8AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 5PM)</option>
                      <option value="evening">Evening (5PM - 8PM)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Instructions (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={deliveryInfo.notes}
                      onChange={handleInputChange}
                      placeholder="Any special delivery instructions..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Choose how you'd like to pay</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedPayment === 'mpesa' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedPayment('mpesa')}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="payment"
                          value="mpesa"
                          checked={selectedPayment === 'mpesa'}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="text-green-600"
                        />
                        <Smartphone className="h-5 w-5 text-green-600" />
                        <div>
                          <h3 className="font-medium">M-Pesa</h3>
                          <p className="text-sm text-gray-600">Pay with your mobile money</p>
                        </div>
                      </div>
                    </div>

                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedPayment === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedPayment('cod')}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={selectedPayment === 'cod'}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="text-green-600"
                        />
                        <CreditCard className="h-5 w-5 text-green-600" />
                        <div>
                          <h3 className="font-medium">Cash on Delivery</h3>
                          <p className="text-sm text-gray-600">Pay when you receive your order</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-600">{item.farmer} × {item.quantity}</p>
                        </div>
                        <p className="font-medium">TSh {item.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <hr />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>TSh {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>TSh {deliveryFee.toLocaleString()}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-green-600">TSh {total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center text-sm text-green-800">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="font-medium">Estimated Delivery: Tomorrow</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Place Order
                  </Button>

                  <p className="text-xs text-gray-600 text-center">
                    By placing this order, you agree to our terms and conditions
                  </p>
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
