import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useGetAdminAnalytics } from '../../hooks/useQueries';
import { Loader2, Users, ShoppingCart, Calendar, Award, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminAnalyticsPanel() {
  const { data: analytics, isLoading, error, refetch } = useGetAdminAnalytics();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    const isAuthError = error instanceof Error && error.message.includes('Unauthorized');
    return (
      <Card>
        <CardContent className="py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {isAuthError
                ? 'Admin access required. Please ensure you are logged in as an admin.'
                : error instanceof Error
                  ? error.message
                  : 'Failed to load analytics. Please try again later.'}
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: 'Total Orders',
      value: analytics?.totalOrders?.toString() || '0',
      icon: ShoppingCart,
      color: 'text-primary',
    },
    {
      label: 'Total Users',
      value: analytics?.totalUsers?.toString() || '0',
      icon: Users,
      color: 'text-accent',
    },
    {
      label: 'Total Bookings',
      value: analytics?.totalBookings?.toString() || '0',
      icon: Calendar,
      color: 'text-secondary',
    },
    {
      label: 'Total Members',
      value: analytics?.totalMembers?.toString() || '0',
      icon: Award,
      color: 'text-muted-foreground',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>Overview of your business metrics</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
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
