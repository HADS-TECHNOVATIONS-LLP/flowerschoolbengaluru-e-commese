import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { MapPin, Loader2 } from "lucide-react";
import { detectUserLocation, isGeolocationSupported, type DetectedAddress } from "@/lib/location";

interface LocationDetectorProps {
  onLocationDetected: (address: DetectedAddress) => void;
  disabled?: boolean;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function LocationDetector({ 
  onLocationDetected, 
  disabled = false,
  variant = "outline",
  size = "default",
  className = ""
}: LocationDetectorProps) {
  const [isDetecting, setIsDetecting] = useState(false);

  const handleDetectLocation = async () => {
    if (!isGeolocationSupported()) {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location detection.",
        variant: "destructive",
      });
      return;
    }

    setIsDetecting(true);

    try {
      const result = await detectUserLocation();

      if (result.success && result.address) {
        onLocationDetected(result.address);
        toast({
          title: "Location Detected",
          description: "Your address has been filled automatically.",
        });
      } else {
        toast({
          title: "Location Detection Failed",
          description: result.error || "Unable to detect your location. Please enter manually.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Location detection error:", error);
      toast({
        title: "Location Detection Failed",
        description: "Please check your location permissions and try again.",
        variant: "destructive",
      });
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={disabled || isDetecting}
      onClick={handleDetectLocation}
      className={`gap-2 ${className}`}
      data-testid="button-detect-location"
    >
      {isDetecting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MapPin className="h-4 w-4" />
      )}
      {isDetecting ? "Detecting..." : "Detect My Location"}
    </Button>
  );
}

export default LocationDetector;