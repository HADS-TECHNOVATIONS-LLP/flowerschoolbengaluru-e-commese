export interface UserProfile {
  id: string;
  email: string;
  firstname: string;
  lastname?: string;
  token: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartContextType {
  placeOrder: (userId?: string) => Promise<{ 
    success: boolean; 
    orderId?: string; 
    order?: {
      id: string;
      orderNumber: string;
    }; 
    error?: string;
  }>;
  // Add other cart context methods here
}