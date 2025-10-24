import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ShoppingCart, MapPin, Truck, CreditCard, Receipt } from "lucide-react";

export type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'review';

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
  completedSteps: CheckoutStep[];
  onStepClick?: (step: CheckoutStep) => void;
  className?: string;
}

export default function CheckoutSteps({ 
  currentStep, 
  completedSteps, 
  onStepClick,
  className 
}: CheckoutStepsProps) {
  const steps = [
    {
      id: 'cart' as CheckoutStep,
      title: 'Cart Review',
      description: 'Review your items',
      icon: ShoppingCart,
    },
    {
      id: 'shipping' as CheckoutStep,
      title: 'Shipping',
      description: 'Address & delivery',
      icon: MapPin,
    },
    {
      id: 'payment' as CheckoutStep,
      title: 'Payment',
      description: 'Payment method',
      icon: CreditCard,
    },
    {
      id: 'review' as CheckoutStep,
      title: 'Order Review',
      description: 'Final confirmation',
      icon: Receipt,
    },
  ];

  const getStepStatus = (stepId: CheckoutStep) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (currentStep === stepId) return 'current';
    return 'upcoming';
  };

  const getStepNumber = (index: number) => index + 1;

  return (
    <Card className={`bg-background ${className}`} data-testid="card-checkout-steps">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const isClickable = onStepClick && (completedSteps.includes(step.id) || step.id === currentStep);
            const IconComponent = step.icon;

            return (
              <div key={step.id} className="flex items-center">
                {/* Step Content */}
                <div 
                  className={`flex flex-col items-center cursor-${isClickable ? 'pointer' : 'default'}`}
                  onClick={isClickable ? () => onStepClick(step.id) : undefined}
                  data-testid={`step-${step.id}`}
                >
                  {/* Step Icon/Number */}
                  <div className={`
                    relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200
                    ${status === 'completed' 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : status === 'current'
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-muted border-muted-foreground/30 text-muted-foreground'
                    }
                    ${isClickable ? 'hover:scale-105' : ''}
                  `}>
                    {status === 'completed' ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <IconComponent className="h-5 w-5" />
                    )}
                    
                    {/* Step Number Badge */}
                    <Badge 
                      variant={status === 'completed' ? 'default' : 'secondary'} 
                      className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                    >
                      {getStepNumber(index)}
                    </Badge>
                  </div>

                  {/* Step Labels */}
                  <div className="mt-3 text-center">
                    <div className={`
                      font-medium text-sm
                      ${status === 'current' ? 'text-primary' : status === 'completed' ? 'text-foreground' : 'text-muted-foreground'}
                    `}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-4 transition-all duration-200
                    ${completedSteps.includes(step.id) ? 'bg-primary' : 'bg-muted'}
                  `} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>
              {Math.round(((completedSteps.length + (currentStep ? 1 : 0)) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${((completedSteps.length + (currentStep ? 0.5 : 0)) / steps.length) * 100}%` 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}