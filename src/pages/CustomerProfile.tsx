import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Package, User, MapPin, Phone, Mail, Edit2, Save, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CustomerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

const CustomerProfile = () => {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<CustomerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      const { data: profile, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile) {
        setProfile(profile);
        setEditedProfile(profile);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editedProfile) return;

    try {
      const { error } = await supabase
        .from('customers')
        .update({
          first_name: editedProfile.first_name,
          last_name: editedProfile.last_name,
          phone: editedProfile.phone,
          address: editedProfile.address
        })
        .eq('id', editedProfile.id);

      if (error) throw error;

      setProfile(editedProfile);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedProfile) return;
    
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center min-h-screen">Profile not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-green-600"
          onClick={() => navigate('/marketplace')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Button>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Profile Information</CardTitle>
          {!isEditing ? (
            <Button onClick={handleEdit} variant="outline" className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                First Name
              </Label>
              <Input
                id="first_name"
                name="first_name"
                value={editedProfile?.first_name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Last Name
              </Label>
              <Input
                id="last_name"
                name="last_name"
                value={editedProfile?.last_name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={editedProfile?.phone || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={editedProfile?.address || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                value={profile.email}
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerProfile; 