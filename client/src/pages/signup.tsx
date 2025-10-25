import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/user-auth";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { ArrowLeft, User, Mail, Phone, Lock, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import logoPath from "@assets/E_Commerce_Bouquet_Bar_Logo_1757484444893.png";

// Add field error state
import React from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [countryCode, setCountryCode] = useState("+91");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { login } = useAuth();

  const signupMutation = useMutation({
    mutationFn: async (userData: { firstName: string; lastName: string; email: string; phone: string; password: string }) => {
      return await apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    onSuccess: async (response) => {
      setFieldErrors({});
      const data = await response.json();
      login(data.user);
    },
    onError: async (error: any) => {
      let errorMsg = "Failed to create account";
      setFieldErrors({});
      if (error?.response) {
        try {
          const data = await error.response.json();
          if (data.errors) {
            setFieldErrors(data.errors);
            errorMsg = Object.values(data.errors).join(", ");
          } else if (data.message) {
            errorMsg = data.message;
          }
        } catch {
          errorMsg = error.message || errorMsg;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setFieldErrors({});
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      setFieldErrors(prev => ({ ...prev, password: "Password must be at least 6 characters long" }));
      toast({
        title: "Error", 
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    signupMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: countryCode + formData.phone,
      password: formData.password,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-200/80 via-rose-200/60 to-pink-300/80 relative overflow-hidden">
          <div className="flex flex-col justify-center px-12 relative z-10">
            <div className="mb-8">
              <img src={logoPath} alt="Bouquet Bar Logo" className="h-28 w-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Join Bouquet Bar
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Start your journey in professional floral design and access premium flower collections.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Shop Premium Flowers</h3>
                  <p className="text-gray-600">Fresh flowers delivered to your door</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Premium Access</h3>
                  <p className="text-gray-600">Exclusive courses and flower collections</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <img src={logoPath} alt="Bouquet Bar Logo" className="h-24 w-auto mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Join Bouquet Bar</h2>
            </div>

            {/* Back Button */}
            {/* <Link href="/shop">
              <Button variant="ghost" className="mb-6 text-gray-600 hover:text-gray-900" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link> */}

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
                <CardDescription className="text-gray-600">
                  Enter your details to join our floral community
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          data-testid="input-first-name"
                        />
                        {fieldErrors.firstName && (
                          <span className="text-xs text-red-500">{fieldErrors.firstName}</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          data-testid="input-last-name"
                        />
                        {fieldErrors.lastName && (
                          <span className="text-xs text-red-500">{fieldErrors.lastName}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        data-testid="input-email"
                      />
                      {fieldErrors.email && (
                        <span className="text-xs text-red-500">{fieldErrors.email}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                    <div className="flex gap-2">
                      <Select value={countryCode} onValueChange={setCountryCode}>
                        <SelectTrigger className="w-[100px] border-gray-200 focus:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+91">+91</SelectItem>
                          <SelectItem value="+1">+1</SelectItem>
                          <SelectItem value="+44">+44</SelectItem>
                          <SelectItem value="+65">+65</SelectItem>
                          <SelectItem value="+971">+971</SelectItem>
                          <SelectItem value="+86">+86</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                          placeholder="00000 00000"
                          value={formData.phone}
                          onChange={handleInputChange}
                          data-testid="input-phone"
                        />
                        {fieldErrors.phone && (
                          <span className="text-xs text-red-500">{fieldErrors.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange}
                        data-testid="input-password"
                      />
                      {fieldErrors.password && (
                        <span className="text-xs text-red-500">{fieldErrors.password}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        data-testid="input-confirm-password"
                      />
                      {fieldErrors.confirmPassword && (
                        <span className="text-xs text-red-500">{fieldErrors.confirmPassword}</span>
                      )}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full text-lg py-3 h-auto font-semibold"
                    disabled={signupMutation.isPending}
                    data-testid="button-signup"
                  >
                    {signupMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>


                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-primary hover:text-primary/80 font-semibold">
                      Sign In
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
