import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, ShoppingCart, Package, Zap, BarChart3, BookOpen, MapPin, Leaf, Calendar, Users } from 'lucide-react';
import AdminGate from '../components/auth/AdminGate';
import AdminOrdersQueuePanel from './admin/AdminOrdersQueuePanel';
import AdminInventoryPanel from './admin/AdminInventoryPanel';
import AdminElectricityAtsPanel from './admin/AdminElectricityAtsPanel';
import AdminAnalyticsPanel from './admin/AdminAnalyticsPanel';
import AdminMuseumContentPanel from './admin/AdminMuseumContentPanel';
import AdminOriginMapPanel from './admin/AdminOriginMapPanel';
import AdminSocialImpactPanel from './admin/AdminSocialImpactPanel';
import AdminBookingsPanel from './admin/AdminBookingsPanel';
import AdminLoyaltyVerificationPanel from './admin/AdminLoyaltyVerificationPanel';
import AdminPackagesPanel from './admin/AdminPackagesPanel';
import AdminLoyaltyRewardsPanel from './admin/AdminLoyaltyRewardsPanel';

export default function AdminDashboardPage() {
  return (
    <AdminGate>
      <div className="container px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">Manage your D'ZETA ecosystem</p>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
            <TabsTrigger value="orders" className="flex flex-col gap-1 py-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="text-xs">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex flex-col gap-1 py-2">
              <Package className="h-4 w-4" />
              <span className="text-xs">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="electricity" className="flex flex-col gap-1 py-2">
              <Zap className="h-4 w-4" />
              <span className="text-xs">ATS</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex flex-col gap-1 py-2">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="museum" className="flex flex-col gap-1 py-2">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs">Museum</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex flex-col gap-1 py-2">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Bookings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <AdminOrdersQueuePanel />
          </TabsContent>

          <TabsContent value="inventory">
            <AdminInventoryPanel />
          </TabsContent>

          <TabsContent value="electricity">
            <AdminElectricityAtsPanel />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalyticsPanel />
          </TabsContent>

          <TabsContent value="museum" className="space-y-6">
            <AdminMuseumContentPanel />
            <AdminOriginMapPanel />
            <AdminSocialImpactPanel />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <AdminBookingsPanel />
            <AdminPackagesPanel />
          </TabsContent>
        </Tabs>
      </div>
    </AdminGate>
  );
}
