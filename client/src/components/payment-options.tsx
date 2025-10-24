import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Banknote,
  Check,
  AlertCircle,
  QrCode
} from "lucide-react";
import { useCart, type PaymentMethod, type PaymentData } from "@/hooks/cart-context";
import { useToast } from "@/hooks/use-toast";

// Zod schemas for payment validation
const cardPaymentSchema = z.object({
  holderName: z.string()
    .min(2, "Cardholder name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces"),
  number: z.string()
    .regex(/^\d{16}$/, "Card number must be 16 digits")
    .refine((val) => {
      // Basic Luhn algorithm validation
      let sum = 0;
      let isEven = false;
      for (let i = val.length - 1; i >= 0; i--) {
        let digit = parseInt(val[i]);
        if (isEven) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
      }
      return sum % 10 === 0;
    }, "Invalid card number"),
  expiryMonth: z.string()
    .regex(/^(0[1-9]|1[0-2])$/, "Invalid month format (MM)"),
  expiryYear: z.string()
    .regex(/^\d{2}$/, "Invalid year format (YY)")
    .refine((val) => {
      const year = parseInt(val) + 2000;
      const currentYear = new Date().getFullYear();
      return year >= currentYear && year <= currentYear + 10;
    }, "Card has expired or invalid year"),
  cvv: z.string()
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

const upiPaymentSchema = z.object({
  upiId: z.string()
    .regex(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/, "Invalid UPI ID format (e.g., user@paytm)")
    .min(1, "UPI ID is required"),
});

const netbankingPaymentSchema = z.object({
  bankName: z.string().min(1, "Please select a bank"),
  accountType: z.enum(["savings", "current"]).default("savings"),
});

const codPaymentSchema = z.object({
  confirmed: z.boolean().refine(val => val, "Please confirm COD payment"),
});

const qrcodePaymentSchema = z.object({
  confirmed: z.boolean().refine(val => val, "Please confirm QR Code payment"),
  amount: z.number().min(1, "Amount must be specified"),
});

type CardFormData = z.infer<typeof cardPaymentSchema>;
type UPIFormData = z.infer<typeof upiPaymentSchema>;
type NetbankingFormData = z.infer<typeof netbankingPaymentSchema>;
type CODFormData = z.infer<typeof codPaymentSchema>;
type QRCodeFormData = z.infer<typeof qrcodePaymentSchema>;

// Indian banks for netbanking
const INDIAN_BANKS = [
  { value: "sbi", label: "State Bank of India" },
  { value: "hdfc", label: "HDFC Bank" },
  { value: "icici", label: "ICICI Bank" },
  { value: "axis", label: "Axis Bank" },
  { value: "kotak", label: "Kotak Mahindra Bank" },
  { value: "indusind", label: "IndusInd Bank" },
  { value: "yes", label: "Yes Bank" },
  { value: "pnb", label: "Punjab National Bank" },
  { value: "bob", label: "Bank of Baroda" },
  { value: "canara", label: "Canara Bank" },
  { value: "union", label: "Union Bank of India" },
  { value: "indian", label: "Indian Bank" },
];

// Payment method options
const PAYMENT_METHODS = [
  {
    id: 'card' as PaymentMethod,
    title: 'Credit/Debit Card',
    description: 'Pay securely with your card',
    icon: CreditCard,
    fees: 0,
  },
  {
    id: 'upi' as PaymentMethod,
    title: 'UPI',
    description: 'Pay instantly with UPI',
    icon: Smartphone,
    fees: 0,
  },
  {
    id: 'netbanking' as PaymentMethod,
    title: 'Net Banking',
    description: 'Pay through your bank',
    icon: Building2,
    fees: 0,
  },
  {
    id: 'cod' as PaymentMethod,
    title: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: Banknote,
    fees: 50,
  },
  {
    id: 'qrcode' as PaymentMethod,
    title: 'QR Code',
    description: 'Scan QR code to pay instantly',
    icon: QrCode,
    fees: 0,
  },
];

interface PaymentOptionsProps {
  onPaymentComplete?: () => void;
}

export default function PaymentOptions({ onPaymentComplete }: PaymentOptionsProps) {
  const { 
    paymentData, 
    paymentCharge,
    setPaymentMethod, 
    updatePaymentData,
    validatePaymentData 
  } = useCart();
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Card Payment Form Component
  const CardPaymentForm = () => {
    const form = useForm<CardFormData>({
      resolver: zodResolver(cardPaymentSchema),
      defaultValues: {
        holderName: paymentData.cardData?.holderName || "",
        number: paymentData.cardData?.number || "",
        expiryMonth: paymentData.cardData?.expiryMonth || "",
        expiryYear: paymentData.cardData?.expiryYear || "",
        cvv: paymentData.cardData?.cvv || "",
      },
    });

    const handleSubmit = (data: CardFormData) => {
      updatePaymentData({
        cardData: data,
      });
      setValidationErrors([]);
      toast({
        title: "Card Details Saved",
        description: "Your card information has been securely saved",
      });
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCardNumber(e.target.value);
      const unformatted = formatted.replace(/\s/g, '');
      form.setValue('number', unformatted);
      e.target.value = formatted;
    };

    return (
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="cardholder-name">Cardholder Name</Label>
          <Input
            id="cardholder-name"
            placeholder="Enter name as on card"
            data-testid="input-cardholder-name"
            {...form.register("holderName")}
          />
          {form.formState.errors.holderName && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.holderName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="card-number">Card Number</Label>
          <Input
            id="card-number"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            data-testid="input-card-number"
            onChange={handleCardNumberChange}
            defaultValue={paymentData.cardData?.number ? formatCardNumber(paymentData.cardData.number) : ""}
          />
          {form.formState.errors.number && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.number.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="expiry-month">Month</Label>
            <Select onValueChange={(value) => form.setValue('expiryMonth', value)}>
              <SelectTrigger data-testid="select-expiry-month">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = String(i + 1).padStart(2, '0');
                  return (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {form.formState.errors.expiryMonth && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.expiryMonth.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="expiry-year">Year</Label>
            <Select onValueChange={(value) => form.setValue('expiryYear', value)}>
              <SelectTrigger data-testid="select-expiry-year">
                <SelectValue placeholder="YY" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 11 }, (_, i) => {
                  const year = String(new Date().getFullYear() + i).slice(-2);
                  return (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {form.formState.errors.expiryYear && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.expiryYear.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              placeholder="123"
              maxLength={4}
              type="password"
              data-testid="input-cvv"
              {...form.register("cvv")}
            />
            {form.formState.errors.cvv && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.cvv.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" data-testid="button-save-card">
          Save Card Details
        </Button>
      </form>
    );
  };

  // UPI Payment Form Component
  const UPIPaymentForm = () => {
    const form = useForm<UPIFormData>({
      resolver: zodResolver(upiPaymentSchema),
      defaultValues: {
        upiId: paymentData.upiData?.upiId || "",
      },
    });

    const handleSubmit = (data: UPIFormData) => {
      updatePaymentData({
        upiData: data,
      });
      setValidationErrors([]);
      toast({
        title: "UPI ID Saved",
        description: "Your UPI information has been saved",
      });
    };

    return (
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="upi-id">UPI ID</Label>
          <Input
            id="upi-id"
            placeholder="yourname@paytm"
            data-testid="input-upi-id"
            {...form.register("upiId")}
          />
          {form.formState.errors.upiId && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.upiId.message}
            </p>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Enter your UPI ID (e.g., user@paytm, user@gpay, user@phonepe)</p>
        </div>

        <Button type="submit" className="w-full" data-testid="button-save-upi">
          Save UPI Details
        </Button>
      </form>
    );
  };

  // Net Banking Form Component
  const NetBankingForm = () => {
    const form = useForm<NetbankingFormData>({
      resolver: zodResolver(netbankingPaymentSchema),
      defaultValues: {
        bankName: paymentData.netbankingData?.bankName || "",
        accountType: (paymentData.netbankingData?.accountType as "savings" | "current") || "savings",
      },
    });

    const handleSubmit = (data: NetbankingFormData) => {
      updatePaymentData({
        netbankingData: data,
      });
      setValidationErrors([]);
      toast({
        title: "Bank Details Saved",
        description: "Your bank information has been saved",
      });
    };

    return (
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="bank-name">Select Your Bank</Label>
          <Select onValueChange={(value) => form.setValue('bankName', value)}>
            <SelectTrigger data-testid="select-bank-name">
              <SelectValue placeholder="Choose your bank" />
            </SelectTrigger>
            <SelectContent>
              {INDIAN_BANKS.map((bank) => (
                <SelectItem key={bank.value} value={bank.value}>
                  {bank.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.bankName && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.bankName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="account-type">Account Type</Label>
          <Select onValueChange={(value) => form.setValue('accountType', value as "savings" | "current")}>
            <SelectTrigger data-testid="select-account-type">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="savings">Savings Account</SelectItem>
              <SelectItem value="current">Current Account</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.accountType && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.accountType.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" data-testid="button-save-netbanking">
          Save Bank Details
        </Button>
      </form>
    );
  };

  // COD Payment Form Component
  const CODPaymentForm = () => {
    const form = useForm<CODFormData>({
      resolver: zodResolver(codPaymentSchema),
      defaultValues: {
        confirmed: paymentData.codData?.confirmed || false,
      },
    });

    const handleSubmit = (data: CODFormData) => {
      updatePaymentData({
        codData: data,
      });
      setValidationErrors([]);
      toast({
        title: "COD Confirmed",
        description: "Cash on Delivery has been selected",
      });
    };

    return (
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Alert>
          <Banknote className="h-4 w-4" />
          <AlertDescription>
            Pay ₹{paymentCharge} extra as Cash on Delivery charges. You can pay the remaining amount when your order is delivered.
          </AlertDescription>
        </Alert>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="cod-confirm"
            data-testid="checkbox-cod-confirm"
            {...form.register("confirmed")}
            className="rounded border-border"
          />
          <Label htmlFor="cod-confirm" className="text-sm">
            I confirm that I want to pay Cash on Delivery
          </Label>
        </div>
        {form.formState.errors.confirmed && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.confirmed.message}
          </p>
        )}

        <Button type="submit" className="w-full" data-testid="button-confirm-cod">
          Confirm Cash on Delivery
        </Button>
      </form>
    );
  };

  // QR Code Payment Form Component  
  const QRCodePaymentForm = () => {
    const { finalAmount } = useCart();
    const form = useForm<QRCodeFormData>({
      resolver: zodResolver(qrcodePaymentSchema),
      defaultValues: {
        confirmed: paymentData.qrcodeData?.confirmed || false,
        amount: finalAmount,
      },
    });

    const handleSubmit = (data: QRCodeFormData) => {
      updatePaymentData({
        qrcodeData: data,
      });
      setValidationErrors([]);
      toast({
        title: "QR Code Payment Ready",
        description: "QR Code payment has been selected",
      });
    };

    // Generate QR Code data (in real implementation, this would come from payment gateway)
    const qrCodeData = `upi://pay?pa=bouquetbar@paytm&pn=Bouquet%20Bar&am=${finalAmount}&cu=INR&tn=Payment%20for%20order`;

    return (
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Alert>
          <QrCode className="h-4 w-4" />
          <AlertDescription>
            Scan the QR code with any UPI app to pay ₹{finalAmount.toLocaleString()} instantly. No additional charges.
          </AlertDescription>
        </Alert>

        {/* QR Code Display */}
        <div className="flex justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <div className="text-center">
            <QrCode className="h-24 w-24 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">QR Code for ₹{finalAmount.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Scan with any UPI app</p>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="text-sm text-gray-600 space-y-2">
          <p className="font-medium">How to pay:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Open any UPI app (PhonePe, Paytm, GPay, etc.)</li>
            <li>Tap on "Scan QR Code"</li>
            <li>Scan the QR code above</li>
            <li>Verify the amount and complete payment</li>
          </ol>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="qrcode-confirm"
            data-testid="checkbox-qrcode-confirm"
            {...form.register("confirmed")}
            className="rounded border-border"
          />
          <Label htmlFor="qrcode-confirm" className="text-sm">
            I confirm that I want to pay via QR Code scan
          </Label>
        </div>
        {form.formState.errors.confirmed && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.confirmed.message}
          </p>
        )}

        <Button type="submit" className="w-full" data-testid="button-confirm-qrcode">
          Confirm QR Code Payment
        </Button>
      </form>
    );
  };

  // Handle payment method selection
  const handleMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setValidationErrors([]);
  };

  // Validate and complete payment
  const handleCompletePayment = () => {
    const isValid = validatePaymentData();
    
    if (!isValid) {
      const errors = [];
      if (!paymentData.selectedMethod) {
        errors.push("Please select a payment method");
      } else {
        errors.push(`Please fill in all required ${paymentData.selectedMethod} details`);
      }
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    onPaymentComplete?.();
  };

  return (
    <Card data-testid="card-payment-options">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div className="grid gap-3">
          <h3 className="font-medium">Choose Payment Method</h3>
          <div className="grid gap-3">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              const isSelected = paymentData.selectedMethod === method.id;
              
              return (
                <div
                  key={method.id}
                  className={`border rounded-lg p-4 cursor-pointer hover-elevate transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => handleMethodSelect(method.id)}
                  data-testid={`button-payment-${method.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{method.title}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.fees > 0 && (
                        <span className="text-sm text-muted-foreground">
                          +₹{method.fees}
                        </span>
                      )}
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Form */}
        {paymentData.selectedMethod && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-medium">Payment Details</h3>
              
              {paymentData.selectedMethod === 'card' && <CardPaymentForm />}
              {paymentData.selectedMethod === 'upi' && <UPIPaymentForm />}
              {paymentData.selectedMethod === 'netbanking' && <NetBankingForm />}
              {paymentData.selectedMethod === 'cod' && <CODPaymentForm />}
              {paymentData.selectedMethod === 'qrcode' && <QRCodePaymentForm />}
            </div>
          </>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive" data-testid="alert-payment-errors">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Complete Payment Button */}
        {paymentData.selectedMethod && (
          <Button 
            onClick={handleCompletePayment}
            className="w-full"
            size="lg"
            data-testid="button-complete-payment"
          >
            Complete Payment Setup
          </Button>
        )}
      </CardContent>
    </Card>
  );
}