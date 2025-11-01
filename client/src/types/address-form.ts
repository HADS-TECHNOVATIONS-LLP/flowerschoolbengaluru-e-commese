import { z } from "zod";

export const addressFormSchema = z.object({
  userId: z.string(),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().regex(
    /^(\+91|0)?[6-9]\d{9}$/,
    "Please enter a valid Indian mobile number"
  ),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  addressLine1: z.string().min(5, "Address must be at least 5 characters"),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().regex(
    /^[1-9][0-9]{5}$/,
    "Please enter a valid 6-digit postal code"
  ),
  country: z.string().min(1, "Country is required").default("India"),
  addressType: z.enum(["Home", "Office", "Other"]).default("Home"),
  isDefault: z.boolean().default(false),
});

export type AddressFormData = z.infer<typeof addressFormSchema>;

export interface Address extends AddressFormData {
  id: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InsertAddress {
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