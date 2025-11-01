import { z } from "zod";

export const addressFormSchema = z.object({
  userId: z.string(),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  email: z.string().email("Please enter a valid email address").nullable(),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().nullable(),
  landmark: z.string().nullable(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit postal code"),
  country: z.string().min(1, "Country is required"),
  addressType: z.enum(["Home", "Office", "Other"]),
  isDefault: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressFormSchema>;

export interface Address {
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
  createdAt: Date;
  updatedAt: Date;
}

export type InsertAddress = Omit<Address, "id" | "createdAt" | "updatedAt">;