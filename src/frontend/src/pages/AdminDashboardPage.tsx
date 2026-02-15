import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, ShoppingCart, BarChart3 } from 'lucide-react';
import AdminGate from '../components/auth/AdminGate';
import AdminOrdersQueuePanel from './admin/AdminOrdersQueuePanel';
import AdminAnalyticsPanel from './admin/AdminAnalyticsPanel';

export default function AdminDashboardPage() {
  return (
    <AdminGate>
      <div className="container px-4 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage orders, bookings, and view analytics</p>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders & Queue
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <AdminOrdersQueuePanel />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <AdminAnalyticsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </AdminGate>
  );
}
