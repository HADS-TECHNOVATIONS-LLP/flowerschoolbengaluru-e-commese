export interface CartAddress {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string | null;
  addressLine1: string;
  addressLine2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: "Home" | "Office" | "Other";
  isDefault: boolean;
}