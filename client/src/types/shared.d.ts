// Common interfaces shared across components

export interface AddressFormProps {
  formData: AddressFormData;
  setFormData: (data: AddressFormData) => void;
  formErrors: Record<string, string>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  showDefaultOption: boolean;
}

export interface AddressFormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  addressType?: string;
}

// This represents the shape of address data in useCart() hook
export interface CartAddress {
  id: string;
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
}