import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAdminAnalytics } from '../../hooks/useQueries';
import { Loader2, Users, ShoppingCart, Calendar, Award } from 'lucide-react';

export default function AdminAnalyticsPanel() {
  const { data: analytics, isLoading } = useGetAdminAnalytics();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: 'Total Orders',
      value: analytics?.totalOrders.toString() || '0',
      icon: ShoppingCart,
      color: 'text-blue-600',
    },
    {
      label: 'Total Users',
      value: analytics?.totalUsers.toString() || '0',
      icon: Users,
      color: 'text-green-600',
    },
    {
      label: 'Total Bookings',
      value: analytics?.totalBookings.toString() || '0',
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      label: 'Total Members',
      value: analytics?.totalMembers.toString() || '0',
      icon: Award,
      color: 'text-amber-600',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Analytics</CardTitle>
          <CardDescription>Overview of your business metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
