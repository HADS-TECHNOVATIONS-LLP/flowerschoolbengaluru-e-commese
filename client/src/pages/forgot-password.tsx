import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import logoPath from "@assets/E_Commerce_Bouquet_Bar_Logo_1757484444893.png";

export default function ForgotPassword() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: { contact: string; contactType: string }) => {
      return await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "OTP Sent!",
        description: "Verification code sent to your phone via SMS",
      });
      // Navigate to OTP verification with contact info
      const fullPhoneNumber = countryCode + phoneNumber;
      setLocation(`/verify-otp?contact=${encodeURIComponent(fullPhoneNumber)}&type=phone`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number (10 digits for Indian numbers)
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    const fullPhoneNumber = countryCode + cleanPhone;
    forgotPasswordMutation.mutate({
      contact: fullPhoneNumber,
      contactType: "phone",
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Only allow numbers, spaces, and dashes for formatting
    value = value.replace(/[^\d\s-]/g, '');
    
    // Format as XXX XXX XXXX for better readability
    if (value.length <= 10) {
      if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1 $2 $3');
      } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{0,3})/, '$1 $2');
      }
    }
    
    setPhoneNumber(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-200/80 via-rose-200/60 to-pink-300/80 relative overflow-hidden">
          <div className="flex flex-col justify-center px-12 relative z-10">
            <div className="text-white">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Forgot Your
                <span className="block text-pink-600">Password?</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-pink-800">
                No worries! We'll send you a secure verification code via SMS to reset your password.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-pink-900">SMS Verification</h3>
                    <p className="text-pink-700">Instant OTP delivery to your phone</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-pink-900">Secure & Fast</h3>
                    <p className="text-pink-700">Protected with Twilio Verify service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-500/20 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-rose-400/30 rounded-full blur-md"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <img src={logoPath} alt="Bouquet Bar Logo" className="h-24 w-auto mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
            </div>

            {/* Back Button */}
            <Link href="/signin">
              <Button variant="ghost" className="mb-6 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Forgot Password</CardTitle>
                <CardDescription className="text-gray-600">
                  Enter your phone number to receive a verification code via SMS
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Phone Number
                    </Label>
                    <div className="flex gap-2">
                      <Select value={countryCode} onValueChange={setCountryCode}>
                        <SelectTrigger className="w-[100px] border-gray-200 focus:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+91">🇮🇳 +91</SelectItem>
                          <SelectItem value="+1">🇺🇸 +1</SelectItem>
                          <SelectItem value="+44">🇬🇧 +44</SelectItem>
                          <SelectItem value="+65">🇸🇬 +65</SelectItem>
                          <SelectItem value="+971">🇦🇪 +971</SelectItem>
                          <SelectItem value="+86">🇨🇳 +86</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20 text-lg"
                          placeholder="000 000 0000"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          maxLength={13}
                          data-testid="input-phone"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      We'll send a verification code via SMS to this number
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full font-semibold py-3 text-lg"
                    disabled={forgotPasswordMutation.isPending}
                    data-testid="button-send-otp"
                  >
                    {forgotPasswordMutation.isPending ? "Sending..." : "Send Verification Code"}
                  </Button>
                </form>

                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-gray-600">
                    Remember your password?{" "}
                    <Link href="/signin" className="text-primary hover:text-primary/80 font-semibold">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}