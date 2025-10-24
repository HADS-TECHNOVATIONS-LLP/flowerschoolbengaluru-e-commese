import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Truck, Clock, Zap, AlertCircle } from "lucide-react";
import { useCart } from "@/hooks/cart-context";
import type { DeliveryOption as BaseDeliveryOption } from "@shared/schema";

interface DeliveryOption extends BaseDeliveryOption {
  description: string;
}

interface DeliveryOptionsProps {
  className?: string;
}

export default function DeliveryOptions({ className }: DeliveryOptionsProps) {
  const { 
    deliveryOption,
    setDeliveryOption,
    loadDeliveryOptions
  } = useCart();
  
  const [options, setOptions] = useState<DeliveryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load delivery options on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedOptions = await loadDeliveryOptions();
        // Transform the data to include descriptions
        const transformedOptions: DeliveryOption[] = fetchedOptions.map(option => ({
          ...option,
          description: `${option.name} delivery within ${option.estimatedDays}`
        }));
        setOptions(transformedOptions);
        
        // Auto-select the first option if none is selected
        if (!deliveryOption && transformedOptions.length > 0) {
          setDeliveryOption(transformedOptions[0]);
        }
      } catch (err) {
        console.error("Error loading delivery options:", err);
        setError("Failed to load delivery options. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [deliveryOption, setDeliveryOption, loadDeliveryOptions]);

  // Format price in INR currency
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (numPrice === 0) return 'Free';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numPrice);
  };

  // Get icon for delivery option based on name
  const getDeliveryIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('same') || lowerName.includes('express')) {
      return <Zap className="h-5 w-5" />;
    } else if (lowerName.includes('standard') || lowerName.includes('regular')) {
      return <Truck className="h-5 w-5" />;
    }
    return <Clock className="h-5 w-5" />;
  };

  // Handle delivery option selection
  const handleOptionChange = (optionId: string) => {
    const selectedOption = options.find(opt => opt.id === optionId);
    if (selectedOption) {
      setDeliveryOption(selectedOption);
    }
  };

  if (isLoading) {
    return (
      <Card className={className} data-testid="card-delivery-options-loading">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Delivery Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3 p-3 border rounded-md">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className} data-testid="card-delivery-options-error">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Delivery Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (options.length === 0) {
    return (
      <Card className={className} data-testid="card-delivery-options-empty">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Delivery Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No delivery options available at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className} data-testid="card-delivery-options">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="mr-2 h-5 w-5" />
          Delivery Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={deliveryOption?.id || ""}
          onValueChange={handleOptionChange}
          className="space-y-3"
        >
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-3">
              <RadioGroupItem 
                value={option.id} 
                id={`delivery-${option.id}`}
                data-testid={`radio-delivery-${option.id}`}
              />
              <Label 
                htmlFor={`delivery-${option.id}`}
                className="flex-1 flex items-center justify-between p-3 border rounded-md cursor-pointer hover-elevate"
                data-testid={`label-delivery-${option.id}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-primary">
                    {getDeliveryIcon(option.name)}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {option.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {option.description}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {option.estimatedDays}
                    </div>
                  </div>
                </div>
                <div className="font-semibold text-foreground" data-testid={`text-delivery-price-${option.id}`}>
                  {formatPrice(option.price)}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {deliveryOption && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Selected Delivery:</span>
              <span className="font-medium text-foreground" data-testid="text-selected-delivery">
                {deliveryOption.name} - {formatPrice(deliveryOption.price)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}