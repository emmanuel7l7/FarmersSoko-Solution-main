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
import { MoreVertical, Search, UserPlus, UserMinus, Mail } from "lucide-react";

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userType, setUserType] = useState<"all" | "farmers" | "customers">("all");

  // Mock data - will be replaced with actual data from Supabase
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      type: "farmer",
      status: "active",
      subscriptionStatus: "paid",
      lastPayment: "2024-03-01",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      type: "customer",
      status: "active",
      subscriptionStatus: "n/a",
      lastPayment: "n/a",
    },
    // Add more mock data as needed
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = userType === "all" || user.type === userType;
    return matchesSearch && matchesType;
  });

  const handleStatusChange = (userId: number, newStatus: string) => {
    // TODO: Implement status change logic with Supabase
    console.log(`Changing status for user ${userId} to ${newStatus}`);
  };

  const handleSendReminder = (userId: number) => {
    // TODO: Implement reminder email logic
    console.log(`Sending reminder to user ${userId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as any)}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All Users</option>
            <option value="farmers">Farmers</option>
            <option value="customers">Customers</option>
          </select>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Last Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.type === "farmer" ? "default" : "secondary"}>
                    {user.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "active" ? "default" : "destructive"}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.type === "farmer" ? (
                    <Badge
                      variant={user.subscriptionStatus === "paid" ? "default" : "destructive"}
                    >
                      {user.subscriptionStatus}
                    </Badge>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>{user.lastPayment}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(user.id, user.status === "active" ? "inactive" : "active")}
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      {user.type === "farmer" && user.subscriptionStatus !== "paid" && (
                        <DropdownMenuItem onClick={() => handleSendReminder(user.id)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Reminder
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

export default UserManagement; 