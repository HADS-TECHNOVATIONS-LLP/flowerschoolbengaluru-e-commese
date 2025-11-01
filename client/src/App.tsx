import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/cart-context";
import { AuthProvider } from "@/hooks/user-auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import SignUp from "@/pages/signup";
import SignIn from "@/pages/signin";
import ForgotPassword from "@/pages/forgot-password";
import VerifyOtp from "@/pages/verify-otp";
import MyAccount from "@/pages/my-account";
import Checkout from "@/pages/checkout";
import OrderConfirmation from "@/pages/order-confirmation";
import OrderTracking from "@/pages/order-tracking";
import type { User } from "@shared/schema";
import ProductsListing from "./pages/ProductsListing";


 
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
    <Route path="/products" component={ProductsListing} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-confirmation/:orderId" component={OrderConfirmation} />
      <Route path="/order-tracking/:id" component={OrderTracking} />
      <Route path="/signup" component={SignUp} />
      <Route path="/signin" component={SignIn} />
      <Route path="/login" component={SignIn} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/verify-otp" component={VerifyOtp} />
      <Route path="/my-account" component={MyAccount} />
      <Route component={NotFound} />
    </Switch>
  );
}
 
function AppWithCart() {
  // Get current user data to provide to CartProvider
  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });
 
  return (
    <CartProvider userId={user?.id}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </CartProvider>
  );
}
 
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppWithCart />
      </AuthProvider>
    </QueryClientProvider>
  );
}
 
export default App;
 
 