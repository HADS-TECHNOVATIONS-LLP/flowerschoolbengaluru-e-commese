import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsapp() {
  const openWhatsApp = () => {
    const phoneNumber = "+919876543210";
    const message = "Hello! I'm interested in your flowers and floral design courses. Could you please help me?";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="floating-whatsapp">
      <Button
        size="icon"
        className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 w-14 h-14"
        onClick={openWhatsApp}
        data-testid="button-floating-whatsapp"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
}
