import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShoppingCart,
  AlertCircle,
  Tag,
  X,
  CheckCircle,
  MapPin,
  Edit,
  Home,
  Building2,
  Star,
  Phone,
  Mail,
  Eye,
  CreditCard,
  Truck
} from "lucide-react";
import { useCart } from "@/hooks/cart-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import DeliveryOptions from "@/components/delivery-options";
import PaymentOptions from "@/components/payment-options";
import { type CheckoutStep } from "@/components/checkout-steps";
import bouquetBarLogo from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface CartItem {
  id: string;
  name: string;
  price: number | string;
  quantity: number;
  category?: string;
  image?: string;
}

// Add Address interface that matches the cart context
interface Address {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: "Home" | "Office" | "Other";
  isDefault: boolean;
}

// Update the DeliveryOption interface to match what's actually available
interface DeliveryOption {
  id: string;
  name: string;
  price: number | string;
  estimatedDays?: number;
  // Remove description property since it's not available in the actual type
}

// Allowed pin codes for Bangalore
const ALLOWED_PIN_CODES = [
  "560034", "560095", "560030", "560047", "560068", "560076",
  "560102", "560011", "560041", "560069", "560027", "560025",
  "560038", "560071", "560001", "560008", "560005", "560004",
  "560006", "560003", "560066", "560037", "560100", "560064",
  "560072", "560024"
];

// Address form schema
const addressFormSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email"),
  addressline1: z.string().min(1, "Address line 1 is required"),
  addressline2: z.string().min(1, "Address line 2 is required"),
  landmark: z.string().min(1, "Landmark is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalcode: z.string()
    .min(6, "Postal code must be 6 digits")
    .max(6, "Postal code must be 6 digits")
    .refine((code) => ALLOWED_PIN_CODES.includes(code), {
      message: "This postal code is not in our delivery area"
    }),
  country: z.string().default("India"),
  addresstype: z.enum(["Home", "Office", "Other"]).default("Home"),
  isdefault: z.boolean().default(false),
});

type AddressFormData = z.infer<typeof addressFormSchema>;

interface AddressData {
  id?: string;
  userid?: string;
  fullname: string;
  phone: string;
  email?: string;
  addressline1: string;
  addressline2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalcode: string;
  country: string;
  addresstype: "Home" | "Office" | "Other";
  isdefault: boolean;
  createdat?: string;
  updatedat?: string;
  isactive?: boolean;
}

// Address Form Component for Checkout
function CheckoutAddressForm({ address, onSuccess }: { address?: AddressData; onSuccess: () => void }) {
  const { toast } = useToast();

  const getDefaultValues = () => ({
    fullname: address?.fullname || "",
    phone: address?.phone || "",
    email: address?.email || "",
    addressline1: address?.addressline1 || "",
    addressline2: address?.addressline2 || "",
    landmark: address?.landmark || "",
    city: address?.city || "",
    state: address?.state || "",
    postalcode: address?.postalcode || "",
    country: address?.country || "India",
    addresstype: (address?.addresstype as "Home" | "Office" | "Other") || "Home",
    isdefault: address?.isdefault || false,
  });

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    const defaultValues = getDefaultValues();
    form.reset(defaultValues);
  }, [address?.id, form]);

  const saveAddressMutation = useMutation({
    mutationFn: async (data: AddressFormData) => {
      const isEdit = address?.id;
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/addresses/${address.id}` : "/api/addresses"

      const requestData = {
        fullName: data.fullname,
        phone: data.phone,
        email: data.email,
        addressLine1: data.addressline1,
        addressLine2: data.addressline2,
        landmark: data.landmark,
        city: data.city,
        state: data.state,
        postalCode: data.postalcode,
        country: data.country,
        addressType: data.addresstype,
        isDefault: data.isdefault,
      };

      const response = await apiRequest(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = `HTTP ${response.status} ${response.statusText}`;
        }
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      let result;
      try {
        result = await response.json();
      } catch (e) {
        result = { success: true };
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addresses"] });
      toast({
        title: "Success",
        description: `Address ${address?.id ? 'updated' : 'added'} successfully`,
      });
      form.reset(getDefaultValues());
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save address",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddressFormData) => {
    saveAddressMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullname">Full Name *</Label>
            <Input
              id="fullname"
              {...form.register("fullname")}
              placeholder="Enter full name"
              className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
            />
            {form.formState.errors.fullname && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.fullname.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              {...form.register("phone")}
              placeholder="Enter phone number"
              className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.phone.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            placeholder="Enter email address"
            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="addressline1">Address Line 1 *</Label>
          <Input
            id="addressline1"
            {...form.register("addressline1")}
            placeholder="House/Flat no, Building name"
            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
          />
          {form.formState.errors.addressline1 && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.addressline1.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="addressline2">Address Line 2 *</Label>
          <Input
            id="addressline2"
            {...form.register("addressline2")}
            placeholder="Area, Locality"
            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
          />
          {form.formState.errors.addressline2 && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.addressline2.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="landmark">Landmark *</Label>
          <Input
            id="landmark"
            {...form.register("landmark")}
            placeholder="Nearby landmark"
            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
          />
          {form.formState.errors.landmark && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.landmark.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              {...form.register("city")}
              placeholder="City"
              className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
            />
            {form.formState.errors.city && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.city.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              {...form.register("state")}
              placeholder="State"
              className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
            />
            {form.formState.errors.state && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.state.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="postalcode">Postal Code *</Label>
            <Input
              id="postalcode"
              {...form.register("postalcode")}
              placeholder="Postal Code"
              maxLength={6}
              className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
            />
            {form.formState.errors.postalcode && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.postalcode.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              {...form.register("country")}
              placeholder="Country"
              className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
            />
            {form.formState.errors.country && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.country.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label>Address Type</Label>
          <div className="flex gap-4 mt-2">
            {(["Home", "Office", "Other"] as const).map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={type}
                  {...form.register("addresstype")}
                  className="text-pink-600 focus:ring-pink-500"
                />
                <div className="flex items-center gap-1">
                  {type === "Home" && <Home className="h-4 w-4" />}
                  {type === "Office" && <Building2 className="h-4 w-4" />}
                  {type === "Other" && <MapPin className="h-4 w-4" />}
                  <span>{type}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...form.register("isdefault")}
            className="text-pink-600 focus:ring-pink-500"
          />
          <span>Make this my default address</span>
        </label>

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={saveAddressMutation.isPending}
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
          >
            {saveAddressMutation.isPending ? "Saving..." : address?.id ? "Update Address" : "Save Address"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Address List Component for Checkout
function CheckoutAddressList({ onSelectAddress }: { onSelectAddress: (address: AddressData) => void }) {
  const { toast } = useToast();
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Fetch addresses
  const { data: addresses = [], isLoading, refetch } = useQuery<AddressData[]>({
    queryKey: ["/api/addresses"],
    queryFn: async () => {
      try {
        const response = await apiRequest("/api/addresses");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
        return [];
      }
    },
    retry: 2,
    staleTime: 0,
  });

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const response = await apiRequest(`/api/addresses/${addressId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addresses"] });
      refetch();
      toast({
        title: "Address deleted",
        description: "Address has been deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete address",
        variant: "destructive",
      });
    },
  });

  // Set Default Address Mutation
  const setDefaultMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const response = await apiRequest(`/api/addresses/${addressId}/set-default`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error(`Failed to set default: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addresses"] });
      toast({
        title: "Default Address Set",
        description: "This address has been set as your default address",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to set default address",
        variant: "destructive",
      });
    },
  });

  const handleEditAddress = (address: AddressData) => {
    setEditingAddress({ ...address });
    setShowEditDialog(true);
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    setEditingAddress(null);
    refetch();
  };

  const handleAddSuccess = () => {
    setShowAddDialog(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-5">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold">Select Delivery Address</h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700 text-white w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-white max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Plus className="h-4 sm:h-5 w-4 sm:w-5" />
                Add New Address
              </DialogTitle>
            </DialogHeader>
            <CheckoutAddressForm onSuccess={handleAddSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <MapPin className="h-8 sm:h-12 w-8 sm:w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No addresses yet</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base px-4">Add your first address to continue</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${address.isdefault ? 'ring-2 ring-pink-500 bg-pink-50/30 border-pink-200' : 'border-gray-200'
                }`}
              onClick={() => onSelectAddress(address)}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {address.addresstype === "Home" && <Home className="h-4 w-4 text-green-600" />}
                        {address.addresstype === "Office" && <Building2 className="h-4 w-4 text-blue-600" />}
                        {address.addresstype === "Other" && <MapPin className="h-4 w-4 text-purple-600" />}
                        <span className="font-medium text-gray-700 text-sm sm:text-base">{address.addresstype}</span>
                      </div>
                      {address.isdefault && (
                        <Badge variant="secondary" className="bg-pink-100 text-pink-700 border-pink-200 text-xs">
                          <Star className="h-3 w-3 mr-1 fill-pink-600" />
                          Default
                        </Badge>
                      )}
                    </div>

                    <div className="mb-3">
                      <p className="font-semibold text-gray-900 text-base sm:text-lg">{address.fullname}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="h-3 w-3 text-pink-600" />
                          {address.phone}
                        </p>
                        {address.email && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="h-3 w-3 text-pink-600" />
                            <span className="truncate">{address.email}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="space-y-1 text-sm text-gray-800">
                        <p>{address.addressline1}</p>
                        {address.addressline2 && <p>{address.addressline2}</p>}
                        {address.landmark && <p>Near {address.landmark}</p>}
                        <p>{address.city}, {address.state} - {address.postalcode}</p>
                        <p>{address.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
                    {!address.isdefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => address.id && setDefaultMutation.mutate(address.id)}
                        className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 border-pink-600 w-full sm:w-auto text-xs sm:text-sm"
                        disabled={setDefaultMutation?.isPending}
                      >
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Set Default
                      </Button>
                    )}

                    <Dialog open={showEditDialog && editingAddress?.id === address.id} onOpenChange={setShowEditDialog}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAddress(address)}
                          className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 border-pink-600 w-full sm:w-auto text-xs sm:text-sm"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg bg-white max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <Edit className="h-4 sm:h-5 w-4 sm:w-5" />
                            Edit Address - {editingAddress?.addresstype}
                          </DialogTitle>
                        </DialogHeader>
                        {editingAddress && editingAddress.id === address.id && (
                          <CheckoutAddressForm
                            address={editingAddress}
                            onSuccess={handleEditSuccess}
                          />
                        )}
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-600 w-full sm:w-auto text-xs sm:text-sm"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white mx-4 sm:mx-auto">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-600 text-base sm:text-lg">
                            Delete Address - {address.addresstype}
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-sm sm:text-base">
                            Are you sure you want to delete this address?
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                              <strong>{address.fullname}</strong><br />
                              {address.addressline1}, {address.city}, {address.state} - {address.postalcode}
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => address.id && deleteAddressMutation.mutate(address.id)}
                            className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                            disabled={deleteAddressMutation.isPending}
                          >
                            {deleteAddressMutation.isPending ? "Deleting..." : "Delete Address"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Add OrderReview component
interface OrderReviewProps {
  onPlaceOrder: () => void;
  onEdit: (section: 'cart' | 'address' | 'delivery' | 'payment') => void;
  isPlacingOrder: boolean;
}

function OrderReview({ onPlaceOrder, onEdit, isPlacingOrder }: OrderReviewProps) {
  const {
    items,
    totalPrice,
    appliedCoupon,
    discountAmount,
    finalAmount,
    deliveryCharge,
    paymentCharge,
    paymentData,
    shippingAddress,
    deliveryOption
  } = useCart();

  // Format price in INR currency
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numPrice);
  };

  // Convert Address object to display string
  const getAddressString = (address: any) => {
    if (typeof address === 'string') return address;
    if (!address) return '';

    // Handle both Address and AddressData formats
    const fullName = address.fullName || address.fullname || '';
    const addressLine1 = address.addressLine1 || address.addressline1 || '';
    const addressLine2 = address.addressLine2 || address.addressline2 || '';
    const city = address.city || '';
    const state = address.state || '';
    const postalCode = address.postalCode || address.postalcode || '';
    const country = address.country || '';
    const landmark = address.landmark || '';

    return `${fullName}, ${addressLine1}, ${addressLine2 ? addressLine2 + ', ' : ''}${landmark ? 'Near ' + landmark + ', ' : ''}${city}, ${state} - ${postalCode}, ${country}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="mr-2 h-5 w-5" />
          Review Order
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Items */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Order Items ({items.length})</h3>
            <Button variant="outline" size="sm" onClick={() => onEdit('cart')}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image ? `data:image/jpeg;base64,${item.image}` : "/placeholder-image.jpg"}
                    alt={item.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">{formatPrice(typeof item.price === 'string' ? parseFloat(item.price) : item.price)}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Shipping Address */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Shipping Address</h3>
            <Button variant="outline" size="sm" onClick={() => onEdit('address')}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm">{getAddressString(shippingAddress)}</p>
          </div>
        </div>

        <Separator />

        {/* Delivery Option */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Delivery Option</h3>
            <Button variant="outline" size="sm" onClick={() => onEdit('delivery')}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium">{deliveryOption?.name}</p>
            {/* Remove description display since it's not available in the DeliveryOption type */}
            {deliveryOption?.estimatedDays && (
              <p className="text-sm text-gray-600">
                Estimated delivery: {deliveryOption.estimatedDays}
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Payment Method */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Payment Method</h3>
            <Button variant="outline" size="sm" onClick={() => onEdit('payment')}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium">{paymentData.selectedMethod?.toUpperCase()}</p>
          </div>
        </div>

        <Separator />

        {/* Order Summary */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          {deliveryOption && (
            <div className="flex justify-between">
              <span>Delivery ({deliveryOption.name})</span>
              <span>
                {typeof deliveryOption.price === 'string'
                  ? parseFloat(deliveryOption.price) > 0
                    ? formatPrice(deliveryOption.price)
                    : 'Free'
                  : deliveryOption.price > 0
                    ? formatPrice(deliveryOption.price)
                    : 'Free'
                }
              </span>
            </div>
          )}

          {paymentCharge > 0 && (
            <div className="flex justify-between">
              <span>Payment Charge</span>
              <span>{formatPrice(paymentCharge)}</span>
            </div>
          )}

          {appliedCoupon && discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({appliedCoupon.code})</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(finalAmount)}</span>
          </div>
        </div>

        {/* Place Order Button */}
        <Button
          size="lg"
          className="w-full"
          onClick={onPlaceOrder}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Checkout() {
  const {
    items,
    totalPrice,
    appliedCoupon,
    discountAmount,
    finalAmount,
    deliveryCharge,
    paymentCharge,
    paymentData,
    shippingAddress, // Changed from selectedAddress to shippingAddress
    deliveryOption,
    isLoading,
    error,
    couponError,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    clearCouponError,
    validatePaymentData,
    placeOrder,
    setShippingAddress // Changed from setSelectedAddress to setShippingAddress
  } = useCart();

  const { toast } = useToast();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [completedSteps, setCompletedSteps] = useState<CheckoutStep[]>([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [, setLocation] = useLocation();
  const [selectedAddressData, setSelectedAddressData] = useState<AddressData | null>(null);

  interface User {
    id: string;
    email: string;
    name?: string;
  }

  // Fetch user profile
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Handle address selection - Fix the type issue
  const handleAddressSelect = (address: AddressData) => {
    // Convert AddressData to the Address format expected by cart context
    const addressForCart: Address = {
      fullName: address.fullname,
      phone: address.phone,
      email: address.email || '',
      addressLine1: address.addressline1,
      addressLine2: address.addressline2 || '',
      landmark: address.landmark || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalcode,
      country: address.country,
      addressType: address.addresstype,
      isDefault: address.isdefault
    };

    setShippingAddress(addressForCart); // Use the proper Address object format
    setSelectedAddressData(address); // Store the full address data locally

    toast({
      title: "Address Selected",
      description: `Delivery address set to ${address.addresstype} address`,
    });
  };

  // Helper function to get shipping address string
  const getShippingAddressString = () => {
    if (!shippingAddress) return '';

    return `${shippingAddress.fullName}, ${shippingAddress.addressLine1}, ${shippingAddress.addressLine2 ? shippingAddress.addressLine2 + ', ' : ''}${shippingAddress.landmark ? 'Near ' + shippingAddress.landmark + ', ' : ''}${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}, ${shippingAddress.country}`;
  };

  // Format price in INR currency
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numPrice);
  };

  // Handle quantity change with loading state
  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle item removal with confirmation
  const handleRemoveItem = async (productId: string, productName: string) => {
    try {
      await removeFromCart(productId);
      toast({
        title: "Item Removed",
        description: `${productName} has been removed from your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  // Handle clear cart with confirmation
  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      try {
        await clearCart();
        toast({
          title: "Cart Cleared",
          description: "All items have been removed from your cart.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to clear cart",
          variant: "destructive",
        });
      }
    }
  };

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    setIsApplyingCoupon(true);
    clearCouponError();

    try {
      const result = await applyCoupon(couponCode);
      if (result.success && result.discountAmount !== undefined) {
        toast({
          title: "Coupon Applied!",
          description: `You saved ${formatPrice(result.discountAmount)} with code ${couponCode.toUpperCase()}`,
        });
        setCouponCode("");
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Handle coupon removal
  const handleRemoveCoupon = () => {
    removeCoupon();
    toast({
      title: "Coupon Removed",
      description: "The discount has been removed from your order",
    });
  };

  // Handle step navigation
  const handleStepComplete = (step: CheckoutStep) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  const handleNext = () => {
    const steps: CheckoutStep[] = ['cart', 'shipping', 'payment', 'review'];
    const currentIndex = steps.indexOf(currentStep);

    handleStepComplete(currentStep);

    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: CheckoutStep[] = ['cart', 'shipping', 'payment', 'review'];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Add interface for order placement response
  interface OrderResponse {
    success: boolean;
    message?: string;
    error?: string;
    order?: {
      id: string;
      ordernumber: string;
      customername: string;
      email: string;
      phone: string;
      status: string;
      total: string;
      createdat: string;
      userid: string;
      deliveryaddress: string;
      subtotal: string;
      deliverycharge: string;
      discountamount: string;
      paymentmethod: string;
      paymentcharges: string;
      paymentstatus: string;
      estimateddeliverydate: string;
      // Add other properties as needed
    };
    calculatedPricing?: {
      subtotal: number;
      deliveryCharge: number;
      discountAmount: number;
      paymentCharges: number;
      total: number;
    };
  }

  // Handle order placement
  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);

    try {
      const result: OrderResponse = await placeOrder(user?.id);

      if (result.success && result.order) {
        // Extract order ID and order number from the response
        const orderId = result.order.id;
        const orderNumber = result.order.ordernumber;

        toast({
          title: "Order Placed Successfully!",
          description: `Your order has been confirmed. Order Number: ${orderNumber}`,
          duration: 5000,
        });

        // Navigate to order confirmation page with the correct order ID
        setLocation(`/order-confirmation/${orderId}`);
      } else {
        toast({
          title: "Order Failed",
          description: result.error || "Failed to place order. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleEditSection = (section: 'cart' | 'address' | 'delivery' | 'payment') => {
    const stepMap: Record<string, CheckoutStep> = {
      cart: 'cart',
      address: 'shipping',
      delivery: 'shipping',
      payment: 'payment'
    };
    setCurrentStep(stepMap[section]);
  };

  // Auto-advance steps based on completion
  useEffect(() => {
    if (items.length > 0 && !completedSteps.includes('cart')) {
      handleStepComplete('cart');
    }

    if (shippingAddress && deliveryOption && !completedSteps.includes('shipping')) {
      handleStepComplete('shipping');
    }

    if (validatePaymentData() && !completedSteps.includes('payment')) {
      handleStepComplete('payment');
    }
  }, [items.length, shippingAddress, deliveryOption, validatePaymentData, completedSteps]);

  // Check if current step can proceed
  const canProceed = () => {
    switch (currentStep) {
      case 'cart':
        return items.length > 0;
      case 'shipping':
        return shippingAddress && deliveryOption;
      case 'payment':
        return validatePaymentData();
      case 'review':
        return true;
      default:
        return false;
    }
  };

  // Loading skeleton component
  const SkeletonRow = () => (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8" />
      </TableCell>
    </TableRow>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Made more responsive */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/" data-testid="link-home">
              <img
                src={bouquetBarLogo}
                alt="Bouquet Bar"
                className="h-8 sm:h-10 w-auto"
              />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground text-center">Shopping Cart</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4 sm:mb-6" data-testid="alert-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {/* Empty Cart State */}
        {!isLoading && items.length === 0 && (
          <Card className="text-center py-8 sm:py-12 mx-2 sm:mx-0" data-testid="card-empty-cart">
            <CardContent className="space-y-4 px-4">
              <ShoppingBag className="h-12 sm:h-16 w-12 sm:w-16 mx-auto text-muted-foreground" />
              <h2 className="text-xl sm:text-2xl font-semibold">Your cart is empty</h2>
              <p className="text-muted-foreground text-sm sm:text-base px-4">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link to="/shop" data-testid="link-continue-shopping">
                <Button size="lg" className="mt-4 w-full sm:w-auto">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Step-based Checkout Flow */}
        {(isLoading || items.length > 0) && (
          <div className="space-y-4 sm:space-y-8">
            {/* Step Content - Improved grid responsiveness */}
            <div className="grid gap-4 sm:gap-8 lg:grid-cols-3">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-8">

                {/* Cart Step */}
                {currentStep === 'cart' && (
                  <Card data-testid="card-cart-items" className="mx-1 sm:mx-0">
                    <CardHeader className="px-4 sm:px-6">
                      <CardTitle className="flex items-center text-lg sm:text-xl">
                        <ShoppingCart className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                        Cart Items ({isLoading ? "..." : items.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-2 sm:px-6">
                      {/* Mobile Card Layout for small screens */}
                      <div className="block sm:hidden space-y-4">
                        {isLoading ? (
                          <>

                            {[...Array(3)].map((_, i) => (
                              <Card key={i} className="animate-pulse">
                                <CardContent className="p-4">
                                  <div className="flex items-center space-x-3">
                                    <Skeleton className="h-16 w-16 rounded" />
                                    <div className="flex-1 space-y-2">
                                      <Skeleton className="h-4 w-32" />
                                      <Skeleton className="h-3 w-24" />
                                      <Skeleton className="h-4 w-16" />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </>
                        ) : (
                          items.map((item) => {
                            const isUpdating = updatingItems.has(item.id);
                            const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                            const lineTotal = itemPrice * item.quantity;

                            return (
                              <Card key={item.id} className="border border-gray-200" data-testid={`card-cart-item-${item.id}`}>
                                <CardContent className="p-4">
                                  <div className="flex items-start space-x-3">
                                    <img
                                      src={item.image ? `data:image/jpeg;base64,${item.image}` : "/placeholder-image.jpg"}
                                      alt={item.name}
                                      className="h-16 w-16 rounded object-cover flex-shrink-0"
                                      data-testid={`img-product-${item.id}`}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-medium text-foreground text-sm truncate" data-testid={`text-product-name-${item.id}`}>
                                        {item.name}
                                      </h3>
                                      <p className="text-xs text-muted-foreground mb-2">
                                        {item.category}
                                      </p>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            disabled={isUpdating || item.quantity <= 1}
                                            data-testid={`button-decrease-${item.id}`}
                                            className="h-8 w-8 p-0"
                                          >
                                            <Minus className="h-3 w-3" />
                                          </Button>
                                          <span className="mx-2 text-sm font-medium min-w-[20px] text-center">{item.quantity}</span>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            disabled={isUpdating || item.quantity >= 99}
                                            data-testid={`button-increase-${item.id}`}
                                            className="h-8 w-8 p-0"
                                          >
                                            <Plus className="h-3 w-3" />
                                          </Button>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleRemoveItem(item.id, item.name)}
                                          disabled={isUpdating}
                                          data-testid={`button-remove-${item.id}`}
                                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <div className="flex items-center justify-between mt-2">
                                        <span className="text-sm text-muted-foreground">
                                          {formatPrice(item.price)} each
                                        </span>
                                        <span className="font-medium text-sm" data-testid={`text-line-total-${item.id}`}>
                                          {formatPrice(lineTotal)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })
                        )}
                      </div>

                      {/* Desktop Table Layout for larger screens */}
                      <div className="hidden sm:block overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead className="hidden md:table-cell">Price</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Subtotal</TableHead>
                              <TableHead className="w-12"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {isLoading ? (
                              <>
                                <SkeletonRow />
                                <SkeletonRow />
                                <SkeletonRow />
                              </>
                            ) : (
                              items.map((item) => {
                                const isUpdating = updatingItems.has(item.id);
                                const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                                const lineTotal = itemPrice * item.quantity;

                                return (
                                  <TableRow key={item.id} data-testid={`row-cart-item-${item.id}`}>
                                    {/* Product Info */}
                                    <TableCell>
                                      <div className="flex items-center space-x-3 sm:space-x-4">
                                        <img
                                          src={item.image ? `data:image/jpeg;base64,${item.image}` : "/placeholder-image.jpg"}
                                          alt={item.name}
                                          className="h-12 w-12 sm:h-16 sm:w-16 rounded object-cover"
                                          data-testid={`img-product-${item.id}`}
                                        />
                                        <div className="min-w-0">
                                          <h3 className="font-medium text-foreground text-sm sm:text-base truncate" data-testid={`text-product-name-${item.id}`}>
                                            {item.name}
                                          </h3>
                                          <p className="text-xs sm:text-sm text-muted-foreground">
                                            {item.category}
                                          </p>
                                          <p className="text-xs sm:hidden text-muted-foreground">
                                            {formatPrice(item.price)}
                                          </p>
                                        </div>
                                      </div>
                                    </TableCell>

                                    {/* Unit Price - Hidden on mobile */}
                                    <TableCell className="hidden md:table-cell" data-testid={`text-unit-price-${item.id}`}>
                                      {formatPrice(item.price)}
                                    </TableCell>

                                    {/* Quantity Controls */}
                                    <TableCell>
                                      <div className="flex items-center space-x-1 sm:space-x-2">
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                          disabled={isUpdating || item.quantity <= 1}
                                          data-testid={`button-decrease-${item.id}`}
                                          className="h-7 w-7 sm:h-8 sm:w-8"
                                        >
                                          <Minus className="h-3 w-3" />
                                        </Button>

                                        <Input
                                          type="number"
                                          min="1"
                                          max="99"
                                          value={item.quantity}
                                          onChange={(e) => {
                                            const newQuantity = parseInt(e.target.value);
                                            if (newQuantity >= 1 && newQuantity <= 99) {
                                              handleQuantityChange(item.id, newQuantity);
                                            }
                                          }}
                                          className="w-12 sm:w-16 text-center text-xs sm:text-sm"
                                          disabled={isUpdating}
                                          data-testid={`input-quantity-${item.id}`}
                                        />

                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                          disabled={isUpdating || item.quantity >= 99}
                                          data-testid={`button-increase-${item.id}`}
                                          className="h-7 w-7 sm:h-8 sm:w-8"
                                        >
                                          <Plus className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </TableCell>

                                    {/* Line Subtotal */}
                                    <TableCell className="font-medium text-sm sm:text-base" data-testid={`text-line-total-${item.id}`}>
                                      {formatPrice(lineTotal)}
                                    </TableCell>

                                    {/* Remove Button */}
                                    <TableCell>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveItem(item.id, item.name)}
                                        disabled={isUpdating}
                                        data-testid={`button-remove-${item.id}`}
                                        className="h-7 w-7 sm:h-8 sm:w-8"
                                      >
                                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Cart Actions */}
                      {!isLoading && items.length > 0 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 pt-4 border-t gap-4">
                          <Button
                            variant="outline"
                            onClick={handleClearCart}
                            data-testid="button-clear-cart"
                            className="w-full sm:w-auto order-2 sm:order-1"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear Cart
                          </Button>

                          <Link to="/shop" className="w-full sm:w-auto order-1 sm:order-2">
                            <Button variant="ghost" data-testid="link-continue-shopping-inline" className="w-full sm:w-auto">
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Continue Shopping
                            </Button>
                          </Link>
                        </div>
                      )}

                      {/* Cart Step Navigation */}
                      <div className="flex flex-col sm:flex-row justify-between pt-4 gap-4">
                        <Link to="/shop" className="w-full sm:w-auto">
                          <Button variant="outline" data-testid="button-continue-shopping" className="w-full sm:w-auto">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Continue Shopping
                          </Button>
                        </Link>

                        <Button
                          onClick={handleNext}
                          disabled={!canProceed()}
                          data-testid="button-next-cart"
                          className="w-full sm:w-auto"
                        >
                          Next: Shipping
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Shipping Step */}
                {currentStep === 'shipping' && (
                  <>
                    {/* Address Selection */}
                    <Card className="mx-1 sm:mx-0">
                      <CardHeader className="px-4 sm:px-6">
                        <CardTitle className="flex items-center text-lg sm:text-xl">
                          <MapPin className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                          Delivery Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6">
                        {!isLoadingUser ? (
                          <CheckoutAddressList onSelectAddress={handleAddressSelect} />
                        ) : (
                          <div className="flex items-center justify-center p-8">
                            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                            <span className="ml-2 text-muted-foreground">Loading addresses...</span>
                          </div>
                        )}

                        {/* Selected Address Display */}
                        {shippingAddress && (
                          <div className="mt-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-green-800 text-sm sm:text-base">Selected Address:</span>
                            </div>
                            <p className="text-xs sm:text-sm text-green-700">{getShippingAddressString()}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <div className="mx-1 sm:mx-0">
                      <DeliveryOptions className="" />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between pt-4 gap-4 px-1 sm:px-0">
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        data-testid="button-back-shipping"
                        className="w-full sm:w-auto"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Cart
                      </Button>

                      <Button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        data-testid="button-next-shipping"
                        className="w-full sm:w-auto"
                      >
                        Next: Payment
                      </Button>
                    </div>
                  </>
                )}

                {/* Payment Step */}
                {currentStep === 'payment' && (
                  <>
                    <div className="mx-1 sm:mx-0">
                      {!isLoadingUser && (
                        <PaymentOptions />
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between pt-4 gap-4 px-1 sm:px-0">
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        data-testid="button-back-payment"
                        className="w-full sm:w-auto"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Shipping
                      </Button>

                      <Button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        data-testid="button-next-payment"
                        className="w-full sm:w-auto"
                      >
                        Next: Review Order
                      </Button>
                    </div>
                  </>
                )}

                {/* Order Review Step */}
                {currentStep === 'review' && (
                  <div className="mx-1 sm:mx-0">
                    <OrderReview
                      onPlaceOrder={handlePlaceOrder}
                      onEdit={handleEditSection}
                      isPlacingOrder={isPlacingOrder}
                    />
                  </div>
                )}
              </div>

              {/* Right Column - Order Summary (for non-review steps) */}
              {currentStep !== 'review' && (
                <div className="lg:col-span-1 lg:sticky lg:top-4 lg:h-fit">
                  <Card data-testid="card-order-summary" className="mx-1 sm:mx-0">
                    <CardHeader className="px-4 sm:px-6">
                      <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-4 sm:px-6">
                      {isLoading ? (
                        <div className="space-y-4">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ) : (
                        <>
                          {/* Coupon Application Section */}
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium text-foreground">Coupon Code</h3>

                            {/* Applied Coupon Display */}
                            {appliedCoupon ? (
                              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                                <div className="flex items-center space-x-2 min-w-0">
                                  <Tag className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                  <span className="text-sm font-medium text-green-700 dark:text-green-300 truncate">
                                    {appliedCoupon.code}
                                  </span>
                                  <span className="text-xs text-green-600 dark:text-green-400 hidden sm:inline">
                                    {appliedCoupon.description || 'Discount applied'}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleRemoveCoupon}
                                  className="h-6 w-6 p-0 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 flex-shrink-0"
                                  data-testid="button-remove-coupon"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                <Input
                                  type="text"
                                  placeholder="Enter coupon code"
                                  value={couponCode}
                                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleApplyCoupon();
                                    }
                                  }}
                                  className="flex-1"
                                  disabled={isApplyingCoupon}
                                  data-testid="input-apply-coupon"
                                />
                                <Button
                                  onClick={handleApplyCoupon}
                                  disabled={isApplyingCoupon || !couponCode.trim()}
                                  size="default"
                                  data-testid="button-apply-coupon"
                                  className="w-full sm:w-auto"
                                >
                                  {isApplyingCoupon ? "Applying..." : "Apply"}
                                </Button>
                              </div>
                            )}

                            {/* Coupon Error Display */}
                            {couponError && (
                              <Alert variant="destructive" data-testid="alert-coupon-error">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-sm">{couponError}</AlertDescription>
                              </Alert>
                            )}
                          </div>

                          <Separator />

                          {/* Order Breakdown */}
                          <div className="space-y-2">
                            {/* Subtotal */}
                            <div className="flex justify-between text-sm sm:text-base">
                              <span>Subtotal</span>
                              <span data-testid="text-subtotal">{formatPrice(totalPrice)}</span>
                            </div>

                            {/* Delivery Charge */}
                            {deliveryOption && (
                              <div className="flex justify-between text-sm sm:text-base">
                                <span className="truncate pr-2">Delivery ({deliveryOption.name})</span>
                                <span data-testid="text-delivery-charge" className="flex-shrink-0">
                                  {typeof deliveryOption.price === 'string'
                                    ? parseFloat(deliveryOption.price) > 0
                                      ? formatPrice(deliveryOption.price)
                                      : 'Free'
                                    : deliveryOption.price > 0
                                      ? formatPrice(deliveryOption.price)
                                      : 'Free'
                                  }
                                </span>
                              </div>
                            )}

                            {/* Payment Charge (for COD, etc.) */}
                            {paymentCharge > 0 && (
                              <div className="flex justify-between text-sm sm:text-base">
                                <span className="truncate pr-2">Payment Charge ({paymentData.selectedMethod?.toUpperCase()})</span>
                                <span data-testid="text-payment-charge" className="flex-shrink-0">
                                  {formatPrice(paymentCharge)}
                                </span>
                              </div>
                            )}

                            {/* Discount Line Item */}
                            {appliedCoupon && discountAmount > 0 && (
                              <div className="flex justify-between text-sm sm:text-base text-green-600 dark:text-green-400">
                                <span className="truncate pr-2">Discount ({appliedCoupon.code})</span>
                                <span data-testid="text-discount" className="flex-shrink-0">-{formatPrice(discountAmount)}</span>
                              </div>
                            )}
                          </div>

                          <Separator />

                          {/* Total */}
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span data-testid="text-total">
                              {formatPrice(finalAmount)}
                            </span>
                          </div>

                          {/* Checkout Button */}
                          <Button
                            size="lg"
                            className="w-full"
                            onClick={() => {
                              handleStepComplete('payment');
                              setCurrentStep('review');
                            }}
                            disabled={items.length === 0 || !shippingAddress || !deliveryOption || !validatePaymentData()}
                            data-testid="button-checkout"
                          >
                            {!shippingAddress ? "Add Shipping Address" :
                              !deliveryOption ? "Select Delivery Option" :
                                !validatePaymentData() ? "Complete Payment Details" :
                                  "Continue to Review"}
                          </Button>

                          {(!shippingAddress || !deliveryOption || !validatePaymentData()) && (
                            <div className="text-xs text-muted-foreground text-center space-y-1">
                              {!shippingAddress && <p>Please add a shipping address.</p>}
                              {!deliveryOption && <p>Please select a delivery option.</p>}
                              {!validatePaymentData() && <p>Please complete payment details.</p>}
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground text-center">
                            Secure checkout powered by Bouquet Bar
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}