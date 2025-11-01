import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Truck, 
  MapPin, 
  ArrowLeft,
  Calendar,
  CreditCard,
  XCircle,
  AlertCircle
} from "lucide-react";
import { format, parseISO } from "date-fns";

interface TrackingData {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    total: string;
    createdAt: string;
    statusUpdatedAt?: string;
    estimatedDeliveryDate?: string;
    pointsAwarded?: number;
  };
  statusHistory: Array<{
    id: string;
    orderId: string;
    status: string;
    notes?: string;
    createdAt: string;
  }>;
  progressSteps: Array<{
    step: string;
    status: string;
    completed: boolean;
  }>;
  canCancel: boolean;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800", 
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: MapPin,
  cancelled: XCircle
};

export default function OrderTracking() {
  const [, params] = useRoute("/order-tracking/:id");
  const orderId = params?.id;

  const { data: trackingData, isLoading, error } = useQuery<TrackingData>({
    queryKey: ["/api/orders", orderId, "tracking"],
    enabled: !!orderId,
  });

  if (!orderId) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Invalid order tracking link.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-10 w-64" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
                <Skeleton className="h-64" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trackingData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error?.message || "Failed to load order tracking information."}
              </AlertDescription>
            </Alert>
            <div className="mt-6">
              <Link to="/my-account">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to My Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { order, statusHistory, progressSteps } = trackingData;
  const StatusIcon = statusIcons[order.status as keyof typeof statusIcons] || Package;
  const currentStep = progressSteps.find(step => step.status === order.status);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link to="/my-account">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground" data-testid="text-order-number">
                Order {order.orderNumber}
              </h1>
              <p className="text-muted-foreground">
                Track your order progress and delivery status
              </p>
            </div>
          </div>

          {/* Order Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon className="h-5 w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Current Status</div>
                  <Badge 
                    className={`mt-2 ${statusColors[order.status as keyof typeof statusColors]}`}
                    data-testid="badge-order-status"
                  >
                    {currentStep?.step || order.status}
                  </Badge>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Order Total</div>
                  <div className="text-xl font-semibold mt-1" data-testid="text-order-total">
                    ₹{parseFloat(order.total).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    {order.estimatedDeliveryDate ? "Estimated Delivery" : "Order Date"}
                  </div>
                  <div className="text-sm font-medium mt-1 flex items-center justify-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {order.estimatedDeliveryDate 
                      ? format(parseISO(order.estimatedDeliveryDate), "MMM dd, yyyy")
                      : format(parseISO(order.createdAt), "MMM dd, yyyy")
                    }
                  </div>
                </div>
              </div>

              {order.pointsAwarded && order.pointsAwarded > 0 && (
                <Alert className="mb-4">
                  <CreditCard className="h-4 w-4" />
                  <AlertDescription>
                    You earned <strong>{order.pointsAwarded} reward points</strong> from this order!
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Order Progress Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

                {/* Progress Steps */}
                <div className="space-y-8" data-testid="timeline-progress">
                  {progressSteps.map((step, index) => {
                    const StepIcon = statusIcons[step.status as keyof typeof statusIcons] || Package;
                    const isCompleted = step.completed;
                    const isCurrent = step.status === order.status;
                    
                    return (
                      <div key={index} className="relative flex items-start gap-4">
                        {/* Timeline Node */}
                        <div className={`
                          relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4
                          ${isCompleted 
                            ? 'bg-primary border-primary text-primary-foreground' 
                            : isCurrent 
                            ? 'bg-background border-primary text-primary animate-pulse'
                            : 'bg-background border-border text-muted-foreground'
                          }
                        `}>
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <StepIcon className="h-5 w-5" />
                          )}
                        </div>

                        {/* Step Content */}
                        <div className="min-w-0 flex-1 pt-1.5">
                          <div className="flex items-center gap-2">
                            <h3 className={`text-sm font-medium ${
                              isCompleted ? 'text-foreground' : 
                              isCurrent ? 'text-primary font-semibold' : 
                              'text-muted-foreground'
                            }`}>
                              {step.step}
                            </h3>
                            
                            {isCompleted && (
                              <Badge variant="secondary" className="text-xs">
                                Complete
                              </Badge>
                            )}
                            
                            {isCurrent && !isCompleted && (
                              <Badge className="text-xs animate-pulse">
                                In Progress
                              </Badge>
                            )}
                          </div>

                          {/* Show status history details for completed steps */}
                          {isCompleted && statusHistory.length > 0 && (
                            <div className="mt-2">
                              {statusHistory
                                .filter(history => history.status === step.status)
                                .map(history => (
                                  <div key={history.id} className="text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {format(parseISO(history.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                                    </div>
                                    {history.notes && (
                                      <div className="mt-1 text-xs">{history.notes}</div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status History Card */}
          {statusHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Status History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3" data-testid="status-history">
                  {statusHistory
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map(history => (
                      <div key={history.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <Badge 
                          className={`${statusColors[history.status as keyof typeof statusColors]} shrink-0`}
                        >
                          {history.status}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium">
                            Status updated to {history.status}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {format(parseISO(history.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                          </div>
                          {history.notes && (
                            <div className="text-sm text-muted-foreground mt-2">
                              {history.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/my-account" className="flex-1">
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </Link>
            <Link to="/shop" className="flex-1">
              <Button className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}