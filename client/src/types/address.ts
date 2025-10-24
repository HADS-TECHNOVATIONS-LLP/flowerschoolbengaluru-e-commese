import { FormEvent } from 'react';

export interface AddressFormData {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: 'Home' | 'Office' | 'Other';
  isDefault: boolean;
}

export interface Address extends Omit<AddressFormData, 'addressLine2' | 'landmark' | 'email'> {
  id: string;
  addressLine2?: string;
  landmark?: string;
  email?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AddressValidation = AddressFormData;

export type AddressFormErrors = {
  [K in keyof AddressFormData]?: string;
};

export interface AddressFormProps {
  formData: AddressFormData;
  setFormData: (data: AddressFormData) => void;
  formErrors: AddressFormErrors;
  onSubmit: (e: FormEvent) => void;
  isSubmitting: boolean;
  showDefaultOption: boolean;
}