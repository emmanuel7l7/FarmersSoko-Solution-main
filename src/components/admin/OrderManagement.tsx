import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Search, Truck, Package, CheckCircle, XCircle } from "lucide-react";

const OrderManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock data - will be replaced with actual data from Supabase
  const orders = [
    {
      id: 1,
      customerName: "John Doe",
      orderDate: "2024-03-15",
      total: 45000,
      status: "pending",
      deliveryStatus: "not_started",
      deliveryFee: 5000,
    },
    {
      id: 2,
      customerName: "Jane Smith",
      orderDate: "2024-03-14",
      total: 75000,
      status: "confirmed",
      deliveryStatus: "in_progress",
      deliveryFee: 0,
    },
    // Add more mock data as needed
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: number, newStatus: string) => {
    // TODO: Implement status change logic with Supabase
    console.log(`Changing status for order ${orderId} to ${newStatus}`);
  };

  const handleDeliveryStatusChange = (orderId: number, newStatus: string) => {
    // TODO: Implement delivery status change logic with Supabase
    console.log(`Changing delivery status for order ${orderId} to ${newStatus}`);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "secondary" | "default" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      completed: "default",
      cancelled: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status}
      </Badge>
    );
  };

  const getDeliveryStatusBadge = (status: string) => {
    const variants: Record<string, "secondary" | "default" | "destructive" | "outline"> = {
      not_started: "secondary",
      in_progress: "default",
      delivered: "default",
      failed: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Delivery Status</TableHead>
              <TableHead>Delivery Fee</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>TSh {order.total.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>{getDeliveryStatusBadge(order.deliveryStatus)}</TableCell>
                <TableCell>
                  {order.deliveryFee > 0 ? `TSh ${order.deliveryFee.toLocaleString()}` : "Free"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(order.id, "confirmed")}
                        disabled={order.status === "confirmed"}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Payment
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(order.id, "completed")}
                        disabled={order.status === "completed"}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(order.id, "cancelled")}
                        disabled={order.status === "cancelled"}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Order
                      </DropdownMenuItem>
                      {order.deliveryFee > 0 && (
                        <DropdownMenuItem
                          onClick={() => handleDeliveryStatusChange(order.id, "in_progress")}
                          disabled={order.deliveryStatus === "in_progress"}
                        >
                          <Truck className="h-4 w-4 mr-2" />
                          Start Delivery
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderManagement; 