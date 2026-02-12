import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useOrderStatusPolling } from '../hooks/useOrderStatusPolling';
import { Loader2, Clock, Users, MapPin, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { OrderStatus } from '../backend';
import InAppNotificationBanner from '../components/InAppNotificationBanner';

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  [OrderStatus.Paid]: {
    label: 'Payment Confirmed',
    color: 'bg-blue-500',
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  [OrderStatus.Preparing]: {
    label: 'Preparing Your Order',
    color: 'bg-amber-500',
    icon: <Clock className="h-5 w-5" />,
  },
  [OrderStatus.Ready]: {
    label: 'Ready for Pickup',
    color: 'bg-green-500',
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  [OrderStatus.Delivering]: {
    label: 'On the Way',
    color: 'bg-purple-500',
    icon: <MapPin className="h-5 w-5" />,
  },
  [OrderStatus.Completed]: {
    label: 'Completed',
    color: 'bg-gray-500',
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  [OrderStatus.Cancelled]: {
    label: 'Cancelled',
    color: 'bg-red-500',
    icon: <AlertCircle className="h-5 w-5" />,
  },
  [OrderStatus.Confirmed]: {
    label: 'Confirmed',
    color: 'bg-blue-500',
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  [OrderStatus.Reserved]: {
    label: 'Reserved',
    color: 'bg-gray-500',
    icon: <Clock className="h-5 w-5" />,
  },
  [OrderStatus.Default]: {
    label: 'Processing',
    color: 'bg-gray-500',
    icon: <Clock className="h-5 w-5" />,
  },
};

export default function OrderStatusPage() {
  const { orderId } = useParams({ from: '/order/$orderId' });
  const navigate = useNavigate();
  const {
    order,
    queuePosition,
    countdown,
    isLoading,
    error,
    notification,
    dismissNotification,
  } = useOrderStatusPolling(Number(orderId));

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container px-4 py-8">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Order not found. Please check your order number and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig[OrderStatus.Default];

  return (
    <div className="container px-4 py-8 max-w-2xl">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      {notification && (
        <InAppNotificationBanner
          message={notification}
          onDismiss={dismissNotification}
        />
      )}

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order #{orderId}</CardTitle>
            <Badge className={`${status.color} text-white`}>
              {status.icon}
              <span className="ml-2">{status.label}</span>
            </Badge>
          </div>
          <CardDescription>Track your order in real-time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {order.status !== OrderStatus.Completed && order.status !== OrderStatus.Cancelled && (
            <>
              {countdown && (
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground mb-2">Estimated Time</p>
                  <p className="text-4xl font-bold text-primary">{countdown}</p>
                </div>
              )}

              {queuePosition && (
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground mb-2">Queue Position</p>
                  <p className="text-2xl font-bold">
                    #{queuePosition.position} of {queuePosition.totalOrders}
                  </p>
                </div>
              )}
            </>
          )}

          {order.deliverTo && (
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Delivery Zone</p>
                <p className="text-sm text-muted-foreground">{order.deliverTo}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Order Timeline</h3>
            <div className="space-y-3">
              {[
                OrderStatus.Paid,
                OrderStatus.Preparing,
                OrderStatus.Ready,
                order.deliverTo ? OrderStatus.Delivering : null,
                OrderStatus.Completed,
              ]
                .filter(Boolean)
                .map((s, idx) => {
                  const stepStatus = statusConfig[s!];
                  const isActive = order.status === s;
                  const isPast =
                    Object.keys(OrderStatus).indexOf(order.status) >
                    Object.keys(OrderStatus).indexOf(s!);

                  return (
                    <div key={s} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isActive || isPast
                            ? stepStatus.color + ' text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {stepStatus.icon}
                      </div>
                      <p
                        className={`text-sm ${
                          isActive ? 'font-semibold' : isPast ? 'text-muted-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {stepStatus.label}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
