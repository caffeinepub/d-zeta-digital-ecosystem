import { useEffect, useState, useRef } from 'react';
import { useGetClientOrders, useGetOrderQueuePosition } from './useQueries';
import { Order, OrderStatus } from '../backend';

interface UseOrderStatusPollingReturn {
  order: Order | null;
  queuePosition: { position: bigint; totalOrders: bigint; estimatedWaitTime: bigint } | null;
  countdown: string | null;
  isLoading: boolean;
  error: Error | null;
  notification: string | null;
  dismissNotification: () => void;
}

export function useOrderStatusPolling(orderId: number): UseOrderStatusPollingReturn {
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetClientOrders();
  const { data: queuePosition, isLoading: queueLoading } = useGetOrderQueuePosition(orderId);
  
  const [countdown, setCountdown] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const previousStatusRef = useRef<OrderStatus | null>(null);

  const order = orders?.find((o) => Number(o.id) === orderId) || null;

  // Update countdown timer
  useEffect(() => {
    if (!queuePosition) {
      setCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const now = Date.now() * 1000000; // Convert to nanoseconds
      const estimatedTime = Number(queuePosition.estimatedWaitTime);
      const remaining = Math.max(0, estimatedTime - now);
      
      const minutes = Math.floor(remaining / 60000000000);
      const seconds = Math.floor((remaining % 60000000000) / 1000000000);
      
      setCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [queuePosition]);

  // Handle status transitions and notifications
  useEffect(() => {
    if (!order) return;

    const currentStatus = order.status;
    const previousStatus = previousStatusRef.current;

    if (previousStatus !== null && previousStatus !== currentStatus) {
      if (currentStatus === OrderStatus.Ready) {
        setNotification('Your order is ready for pickup!');
        triggerVibration();
      } else if (currentStatus === OrderStatus.Delivering) {
        setNotification(`Your order is on the way to ${order.deliverTo || 'your location'}!`);
        triggerVibration();
      }
    }

    previousStatusRef.current = currentStatus;
  }, [order]);

  const triggerVibration = () => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch (error) {
        console.log('Vibration not supported or failed');
      }
    }
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  return {
    order,
    queuePosition: queuePosition || null,
    countdown,
    isLoading: ordersLoading || queueLoading,
    error: ordersError as Error | null,
    notification,
    dismissNotification,
  };
}
