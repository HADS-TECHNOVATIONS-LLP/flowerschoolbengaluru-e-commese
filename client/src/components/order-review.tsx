import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ShoppingCart, 
  MapPin, 
  Truck, 
  CreditCard, 
  Tag, 
  Receipt,
  Edit,
  AlertCircle,
  FileText,
  Shield,
  CheckCircle
} from "lucide-react";
import { useCart } from "@/hooks/cart-context";
import type { PaymentMethod } from "@/hooks/cart-context";
import type { Address, DeliveryOption } from "../types";

interface OrderReviewProps {
  className?: string;
  onPlaceOrder: () => void;
  onEdit: (section: 'cart' | 'address' | 'delivery' | 'payment') => void;
  isPlacingOrder?: boolean;
}

export default function OrderReview({ 
  className,
  onPlaceOrder,
  onEdit,
  isPlacingOrder = false 
}: OrderReviewProps) {
  const {
    items,
    totalPrice,
    appliedCoupon,
    discountAmount,
    finalAmount,
    deliveryCharge,
    paymentCharge,
    shippingAddress,
    deliveryOption,
    paymentData,
    validatePaymentData
  } = useCart();

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [confirmOrder, setConfirmOrder] = useState(false);

  // Format price in INR currency
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numPrice);
  };

  // Get payment method display name
  const getPaymentMethodName = (method: PaymentMethod | null) => {
    switch (method) {
      case 'card': return 'Credit/Debit Card';
      case 'upi': return 'UPI Payment';
      case 'netbanking': return 'Net Banking';
      case 'cod': return 'Cash on Delivery';
      case 'qrcode': return 'QR Code Payment';
      default: return 'Not Selected';
    }
  };

  // Get masked payment details for display
  const getPaymentDisplayDetails = () => {
    if (!paymentData.selectedMethod) return 'No payment method selected';

    switch (paymentData.selectedMethod) {
      case 'card':
        if (paymentData.cardData?.number) {
          const last4 = paymentData.cardData.number.slice(-4);
          return `Card ending in ${last4}`;
        }
        return 'Credit/Debit Card';
      case 'upi':
        if (paymentData.upiData?.upiId) {
          const maskedUpi = paymentData.upiData.upiId.replace(/(.{2})(.*)(@.*)/, '$1***$3');
          return maskedUpi;
        }
        return 'UPI Payment';
      case 'netbanking':
        if (paymentData.netbankingData?.bankName) {
          return `${paymentData.netbankingData.bankName} - ${paymentData.netbankingData.accountType}`;
        }
        return 'Net Banking';
      case 'cod':
        return 'Cash on Delivery';
      case 'qrcode':
        if (paymentData.qrcodeData?.confirmed) {
          return `QR Code Payment - ₹${paymentData.qrcodeData.amount?.toLocaleString() || 'N/A'}`;
        }
        return 'QR Code Payment';
      default:
        return 'Payment method selected';
    }
  };

  // Format address for display
  const formatAddress = (address: any) => {
    if (!address) return 'No address selected';
    
    const parts = [
      address.fullName,
      address.phone,
      address.addressLine1,
      address.addressLine2,
      address.landmark,
      `${address.city}, ${address.state} ${address.postalCode}`,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  // Check if order can be placed
  const canPlaceOrder = () => {
    return (
      items.length > 0 &&
      shippingAddress &&
      deliveryOption &&
      validatePaymentData() &&
      acceptTerms &&
      acceptPrivacy &&
      confirmOrder &&
      !isPlacingOrder
    );
  };

  // Get validation errors
  const getValidationErrors = () => {
    const errors = [];
    if (items.length === 0) errors.push('Cart is empty');
    if (!shippingAddress) errors.push('Shipping address not selected');
    if (!deliveryOption) errors.push('Delivery option not selected');
    if (!validatePaymentData()) errors.push('Payment information incomplete');
    return errors;
  };

  const validationErrors = getValidationErrors();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Order Summary Header */}
      <Card data-testid="card-order-summary">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Receipt className="mr-2 h-5 w-5" />
            Order Review
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Cart Items Review */}
      <Card data-testid="card-cart-review">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Items ({items.length})
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit('cart')}
              data-testid="button-edit-cart"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2" data-testid={`item-review-${item.id}`}>
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded object-cover"
                    data-testid={`img-review-${item.id}`}
                  />
                  <div>
                    <h4 className="font-medium text-sm" data-testid={`text-item-name-${item.id}`}>
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium" data-testid={`text-item-total-${item.id}`}>
                    {formatPrice(parseFloat(item.price as string) * item.quantity)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatPrice(item.price)} each
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address Review */}
      <Card data-testid="card-address-review">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <MapPin className="mr-2 h-5 w-5" />
              Shipping Address
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit('address')}
              data-testid="button-edit-address"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {shippingAddress ? (
            <div className="space-y-2" data-testid="text-shipping-address">
              <div className="font-medium">{shippingAddress.fullName}</div>
              <div className="text-sm text-muted-foreground">{shippingAddress.phone}</div>
              <div className="text-sm">
                {shippingAddress.addressLine1}
                {shippingAddress.addressLine2 && <><br />{shippingAddress.addressLine2}</>}
                {shippingAddress?.landmark && <><br />Near {shippingAddress.landmark}</>}
                <br />
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                <br />
                {shippingAddress.country}
              </div>
              {(shippingAddress as any).addressType && (
                <Badge variant="secondary" className="text-xs">
                  {(shippingAddress as any).addressType}
                </Badge>
              )}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No shipping address selected</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Delivery Option Review */}
      <Card data-testid="card-delivery-review">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <Truck className="mr-2 h-5 w-5" />
              Delivery Method
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit('delivery')}
              data-testid="button-edit-delivery"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {deliveryOption ? (
            <div className="flex items-center justify-between" data-testid="text-delivery-option">
              <div>
                <div className="font-medium">{deliveryOption.name}</div>
                {(deliveryOption as any).description && (
                  <div className="text-sm text-muted-foreground">
                    {(deliveryOption as any).description}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Estimated delivery: {deliveryOption.estimatedDays} day(s)
                </div>
              </div>
              <div className="font-medium">
                {deliveryCharge === 0 ? 'Free' : formatPrice(deliveryCharge)}
              </div>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No delivery option selected</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Payment Method Review */}
      <Card data-testid="card-payment-review">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <CreditCard className="mr-2 h-5 w-5" />
              Payment Method
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit('payment')}
              data-testid="button-edit-payment"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between" data-testid="text-payment-method">
            <div>
              <div className="font-medium">
                {getPaymentMethodName(paymentData.selectedMethod)}
              </div>
              <div className="text-sm text-muted-foreground">
                {getPaymentDisplayDetails()}
              </div>
            </div>
            {paymentCharge > 0 && (
              <div className="font-medium">
                +{formatPrice(paymentCharge)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Applied Coupon */}
      {appliedCoupon && (
        <Card data-testid="card-coupon-review">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Tag className="mr-2 h-4 w-4 text-green-600" />
                <div>
                  <div className="font-medium text-green-600">
                    Coupon Applied: {appliedCoupon.code}
                  </div>
                  {appliedCoupon.description && (
                    <div className="text-sm text-muted-foreground">
                      {appliedCoupon.description}
                    </div>
                  )}
                </div>
              </div>
              <div className="font-medium text-green-600">
                -{formatPrice(discountAmount)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Breakdown */}
      <Card data-testid="card-pricing-breakdown">
        <CardHeader>
          <CardTitle className="text-lg">Price Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal ({items.length} items)</span>
            <span data-testid="text-subtotal">{formatPrice(totalPrice)}</span>
          </div>
          
          {appliedCoupon && (
            <div className="flex justify-between text-green-600">
              <span>Coupon Discount ({appliedCoupon.code})</span>
              <span data-testid="text-discount">-{formatPrice(discountAmount)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span data-testid="text-delivery-charge">
              {deliveryCharge === 0 ? 'Free' : formatPrice(deliveryCharge)}
            </span>
          </div>
          
          {paymentCharge > 0 && (
            <div className="flex justify-between">
              <span>Payment Processing</span>
              <span data-testid="text-payment-charge">{formatPrice(paymentCharge)}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount</span>
            <span data-testid="text-final-amount">{formatPrice(finalAmount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive" data-testid="alert-validation-errors">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div>Please complete the following:</div>
            <ul className="list-disc list-inside mt-2">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Terms and Confirmation */}
      <Card data-testid="card-confirmation">
        <CardHeader>
          <CardTitle className="text-lg">Confirmation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Terms and Conditions */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="accept-terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              data-testid="checkbox-terms"
            />
            <div className="text-sm">
              <label htmlFor="accept-terms" className="cursor-pointer">
                I agree to the{' '}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto text-primary underline" data-testid="button-terms-modal">
                      Terms and Conditions
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <FileText className="mr-2 h-5 w-5" />
                        Terms and Conditions
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-96 pr-4">
                      <div className="space-y-4 text-sm">
                        <section>
                          <h3 className="font-semibold mb-2">1. Order Acceptance</h3>
                          <p>All orders are subject to acceptance by Bouquet Bar. We reserve the right to refuse or cancel any order at any time.</p>
                        </section>
                        <section>
                          <h3 className="font-semibold mb-2">2. Payment Terms</h3>
                          <p>Full payment is required at the time of order placement. We accept all major credit cards, UPI, net banking, and cash on delivery.</p>
                        </section>
                        <section>
                          <h3 className="font-semibold mb-2">3. Delivery</h3>
                          <p>Delivery times are estimates and may vary due to weather conditions, location, and other factors beyond our control. Fresh flowers are perishable items and require immediate care upon delivery.</p>
                        </section>
                        <section>
                          <h3 className="font-semibold mb-2">4. Returns and Refunds</h3>
                          <p>Due to the perishable nature of our products, returns are only accepted in case of damaged or defective items. Refunds will be processed within 5-7 business days.</p>
                        </section>
                        <section>
                          <h3 className="font-semibold mb-2">5. Care Instructions</h3>
                          <p>Proper care instructions will be provided with each order. Following these instructions is essential for maintaining the freshness and longevity of your flowers.</p>
                        </section>
                        <section>
                          <h3 className="font-semibold mb-2">6. Liability</h3>
                          <p>Our liability is limited to the cost of the products. We are not responsible for any consequential or indirect damages.</p>
                        </section>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </label>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="accept-privacy"
              checked={acceptPrivacy}
              onCheckedChange={(checked) => setAcceptPrivacy(checked === true)}
              data-testid="checkbox-privacy"
            />
            <div className="text-sm">
              <label htmlFor="accept-privacy" className="cursor-pointer">
                I acknowledge the{' '}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto text-primary underline" data-testid="button-privacy-modal">
                      Privacy Policy
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <Shield className="mr-2 h-5 w-5" />
                        Privacy Policy
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-96 pr-4">
                      <div className="space-y-4 text-sm">
                        <section>
                          <h3 className="font-semibold mb-2">Information We Collect</h3>
                          <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes name, email, phone number, and address.</p>
                        </section>
                        <section>
                          <h3 className="font-semibold mb-2">How We Use Your Information</h3>
                          <p>We use your information to process orders, communicate with you, provide customer service, and improve our services. We may also send you promotional emails with your consent.</p>
                        </section>
                        <section>
                          <h3 className="font-semibold mb-2">Information Sharing</h3>
                          <p>We do not sell, rent, or share your personal information with third parties except as necessary to fulfill orders (delivery partners) or as required by law.</p>
                        </section>
                        <section>
                          <h3 className="font-semibold mb-2">Data Security</h3>
                          <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
                        </section>
                        <section>
                          <h3 className="font-semibold mb-2">Cookies</h3>
                          <p>We use cookies to enhance your browsing experience and analyze website traffic. You can disable cookies in your browser settings.</p>
                        </section>
                        <section>
                          <h3 className="font-semibold mb-2">Contact Us</h3>
                          <p>If you have any questions about this Privacy Policy, please contact us at privacy@bouquetbar.com.</p>
                        </section>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </label>
            </div>
          </div>

          {/* Order Confirmation */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="confirm-order"
              checked={confirmOrder}
              onCheckedChange={(checked) => setConfirmOrder(checked === true)}
              data-testid="checkbox-confirm"
            />
            <label htmlFor="confirm-order" className="text-sm cursor-pointer">
              I confirm that all the order details are correct and I want to place this order.
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Place Order Button */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => onEdit('payment')}
          data-testid="button-back"
        >
          Back to Payment
        </Button>
        
        <Button
          size="lg"
          onClick={onPlaceOrder}
          disabled={!canPlaceOrder()}
          className="min-w-48"
          data-testid="button-place-order"
        >
          {isPlacingOrder ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-2" />
              Placing Order...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Place Order - {formatPrice(finalAmount)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}