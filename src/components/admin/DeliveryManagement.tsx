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
import { MoreVertical, Search, Plus, Edit, Trash } from "lucide-react";

const DeliveryManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - will be replaced with actual data from Supabase
  const deliveryServices = [
    {
      id: 1,
      name: "Standard Delivery",
      price: 5000,
      estimatedTime: "2-3 days",
      status: "active",
    },
    {
      id: 2,
      name: "Express Delivery",
      price: 10000,
      estimatedTime: "1 day",
      status: "active",
    },
    {
      id: 3,
      name: "Same Day Delivery",
      price: 15000,
      estimatedTime: "Same day",
      status: "inactive",
    },
  ];

  const filteredServices = deliveryServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (serviceId: number, newStatus: string) => {
    // TODO: Implement status change logic with Supabase
    console.log(`Changing status for service ${serviceId} to ${newStatus}`);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "secondary" | "default" | "destructive" | "outline"> = {
      active: "default",
      inactive: "secondary",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status}
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
              placeholder="Search delivery services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Estimated Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>TSh {service.price.toLocaleString()}</TableCell>
                <TableCell>{service.estimatedTime}</TableCell>
                <TableCell>{getStatusBadge(service.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Service
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(service.id, service.status === "active" ? "inactive" : "active")}
                      >
                        {service.status === "active" ? (
                          <>
                            <Trash className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
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

export default DeliveryManagement; 