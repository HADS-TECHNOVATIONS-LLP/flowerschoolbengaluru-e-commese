import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, MessageCircle, PhoneCall, ShoppingBag, GraduationCap, Send, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function ContactSection() {
  const [shopForm, setShopForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    occasion: '',
    requirements: '',
  });

  const [enrollForm, setEnrollForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    courseId: '',
    batch: '',
    questions: '',
  });

  const { toast } = useToast();

  const shopOrderMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      toast({
        title: "Order Request Sent!",
        description: "We'll contact you soon to confirm your flower order.",
      });
      setShopForm({
        customerName: '',
        phone: '',
        email: '',
        occasion: '',
        requirements: '',
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send order request. Please try again.",
        variant: "destructive",
      });
    }
  });

  const enrollmentMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/enrollments', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      toast({
        title: "Enrollment Request Sent!",
        description: "We'll contact you soon with course details and batch information.",
      });
      setEnrollForm({
        fullName: '',
        email: '',
        phone: '',
        courseId: '',
        batch: '',
        questions: '',
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send enrollment request. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleShopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    shopOrderMutation.mutate({
      ...shopForm,
      items: [],
      total: "0.00"
    });
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enrollmentMutation.mutate(enrollForm);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/919972803847?text=Hello! I would like to place a flower order.', '_blank');
  };

  const makeCall = () => {
    window.open('tel:+919972803847', '_self');
  };

  const openMapsInNewTab = () => {
    window.open('https://www.google.com/maps/place/SIPANI+EAST+AVENUE,+6th+Block,+Koramangala,+Bengaluru,+Karnataka+560095', '_blank');
  };

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          
 <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 tracking-tight">
  Get in {" "}
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
    Touch
  </span>{" "}

</h2>
          <p className="text-xl text-muted-foreground">Ready to order flowers or join our classes? We're here to help!</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info - Left Side */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Address</div>
                    <div className="text-muted-foreground">
                      440, 18th Main Rd, 6th Block, Koramangala, Bengaluru, Karnataka 560095
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-muted-foreground">+91 99728 03847</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-muted-foreground">info@flowerschoolbengaluru.com</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Hours</div>
                    <div className="text-muted-foreground">Mon-Sat: 9AM-8PM, Sun: 10AM-6PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Actions</h4>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={openWhatsApp}
                  data-testid="button-whatsapp"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Order
                </Button>
                <Button 
                  onClick={makeCall}
                  data-testid="button-call"
                >
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>
          </div>

          {/* Map - Right Side */}
          <div className="space-y-8">
            {/* Google Maps Integration with Overlay */}
            <div className="relative rounded-xl overflow-hidden h-96">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2855.610430364254!2d77.62079447507593!3d12.94!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDU2JzI0LjAiTiA3N8KwMzcnMjIuOCJF!5e0!3m2!1sen!2sin!4v1710153926784!5m2!1sen!2sin" 
                width="200%" 
                height="200%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Bouquet Bar Location"
                className="pointer-events-none" // This prevents interactions with the iframe
              ></iframe>
              
              {/* Overlay with button to open map in new tab */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300">
                <Button 
                  onClick={openMapsInNewTab}
                  className="bg-white text-gray-900 hover:bg-gray-100 flex items-center gap-2 shadow-lg"
                  size="lg"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Google Maps
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
