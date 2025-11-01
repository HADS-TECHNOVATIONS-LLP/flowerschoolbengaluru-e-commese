import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Menu, X, User, UserPlus, LogOut, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useCart } from "@/hooks/cart-context";
import logoPath from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";
import type { User as UserType } from "@shared/schema";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [showCartModal, setShowCartModal] = useState(false);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get current user data
  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Cart functionality - now using context, no arguments needed
  const { 
    totalItems, 
    totalPrice,
    items,
    isLoading,
    updateQuantity,
    removeFromCart 
  } = useCart();

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/auth/signout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      // Clear user data from cache
      queryClient.setQueryData(["/api/auth/user"], null);
      // Invalidate all cart-related queries to clear cart state
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth"] });
      toast({
        title: "Logged out successfully",
        description: "You have been signed out.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Show nav when at top of page
      if (currentScrollTop <= 50) {
        setIsScrollingUp(false);
      }
      // Hide nav when scrolling up (but not at the very top)
      else if (currentScrollTop < lastScrollTop && currentScrollTop > 50) {
        setIsScrollingUp(true);
      }
      // Show nav when scrolling down
      else if (currentScrollTop > lastScrollTop) {
        setIsScrollingUp(false);
      }
      
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 w-full bg-card/95 backdrop-blur-sm z-50 transition-transform duration-300 ${isScrollingUp ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-3">
            <img src={logoPath} alt="Bouquet Bar Logo" className="h-12 w-auto" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Bouquet Bar</span>
          </div>
          
          
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-home"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('shop')}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-shop"
            >
              Shop
            </button>
            <button 
              onClick={() => scrollToSection('school')}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-school"
            >
              School
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-gallery"
            >
              Gallery
            </button>
           
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-contact"
            >
              Contact
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3 shrink-0">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Welcome,</span>
                    <span className="font-semibold text-primary ml-1">
                      {user?.firstname || 'User'}!
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setLocation('/shop')}
                    data-testid="button-account"
                    className="text-pink-600 border border-pink-300 rounded-full px-4 py-1 text-sm hover:bg-pink-50"
                  >
                    Account
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    data-testid="button-logout"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full px-4 py-1 text-sm hover:from-pink-600 hover:to-purple-700"
                  >
                    {logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => scrollToSection('contact')}
                    data-testid="button-contact"
                    className="text-pink-600 border border-pink-300 rounded-full px-4 py-1 text-sm hover:bg-pink-50"
                  >
                    Contact
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setLocation('/signin')}
                    data-testid="button-login"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full px-4 py-1 text-sm hover:from-pink-600 hover:to-purple-700"
                  >
                    Login
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-home"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('shop')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-shop"
              >
                Shop
              </button>
              <button 
                onClick={() => scrollToSection('school')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-school"
              >
                School
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-gallery"
              >
                Gallery
              </button>
             
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-mobile-contact"
              >
                Contact
              </button>
              
              {/* Mobile Auth Section */}
              <div className="border-t border-border pt-4 mt-4 space-y-3">
                {user ? (
                  <div className="text-center">
                    <div className="text-sm mb-3">
                      <span className="text-muted-foreground">Welcome,</span>
                      <span className="font-semibold text-primary ml-1">
                        {user?.firstname || 'User'}!
                      </span>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => setLocation('/shop')}
                        data-testid="button-mobile-account"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Account
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        data-testid="button-mobile-logout"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={() => setLocation('/signin')}
                      data-testid="button-mobile-signin"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                    <Button 
                      className="w-full" 
                      onClick={() => setLocation('/signup')}
                      data-testid="button-mobile-signup"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
              
            </div>
          </div>
        )}
        
      </div>

     {/* Cart Modal - Updated styling */}
      <Dialog open={showCartModal} onOpenChange={setShowCartModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border border-pink-100">
          <DialogHeader className="bg-pink-25 -m-6 mb-4 p-6 border-b border-pink-100">
            <DialogTitle className="flex items-center gap-2 text-gray-900">
              <ShoppingCart className="h-5 w-5 text-pink-600" />
              Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Review your items and proceed to checkout
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-16 w-16 mx-auto text-pink-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-4">Start shopping to add items to your cart</p>
                <Button 
                  onClick={() => setShowCartModal(false)}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3">
                  {items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border border-pink-100 rounded-lg bg-white hover:bg-pink-25 transition-colors">
                      <img
                        src={item.image ? `data:image/jpeg;base64,${item.image}` : "/placeholder-image.jpg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded border border-pink-100"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                        <p className="text-lg font-bold text-pink-600">₹{parseFloat(item.price).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading}
                          className="border-pink-200 hover:bg-pink-50"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium bg-pink-50 py-1 rounded">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading}
                          className="border-pink-200 hover:bg-pink-50"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.id)}
                          disabled={isLoading}
                          className="ml-2 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="border-pink-100" />

                {/* Cart Summary */}
                <div className="space-y-2 bg-pink-25 p-4 rounded-lg border border-pink-100">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator className="border-pink-100" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-pink-600">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <DialogFooter className="flex-col gap-2">
                  {/* Always show Checkout button - behavior changes based on login status */}
                  <Button 
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    onClick={() => {
                      setShowCartModal(false);
                      if (user) {
                        // User is logged in - go to checkout
                        setLocation('/checkout');
                      } else {
                        // User is not logged in - go to signin
                        setLocation('/signin');
                      }
                    }}
                    data-testid="button-checkout"
                  >
                    Checkout
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCartModal(false)} 
                    className="w-full border-pink-200 text-pink-700 hover:bg-pink-50"
                  >
                    Continue Shopping
                  </Button>
                </DialogFooter>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
