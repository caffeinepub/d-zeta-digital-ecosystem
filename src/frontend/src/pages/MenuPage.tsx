import { Coffee, Clock, Users } from 'lucide-react';
import { menuItems, getAllCategories } from '../data/menuItems';
import { useGetKitchenQueueSummary } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function MenuPage() {
  const { data: queueSummary, isLoading: queueLoading, error: queueError } = useGetKitchenQueueSummary();

  const categories = getAllCategories();

  const formatWaitTime = (estimatedTime: bigint) => {
    const now = Date.now();
    const estimatedMs = Number(estimatedTime) / 1_000_000;
    const diffMinutes = Math.max(0, Math.round((estimatedMs - now) / 60000));

    if (diffMinutes === 0) return 'Ready now';
    if (diffMinutes < 60) return `~${diffMinutes} min`;
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return mins > 0 ? `~${hours}h ${mins}m` : `~${hours}h`;
  };

  return (
    <div className="container max-w-4xl py-8 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Our Menu</h1>
        <p className="text-muted-foreground">Explore our signature drinks and artisan bites</p>
      </div>

      {/* Queue Summary Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Kitchen Queue
          </CardTitle>
          <CardDescription>Current wait time for new orders</CardDescription>
        </CardHeader>
        <CardContent>
          {queueLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-48" />
            </div>
          ) : queueError ? (
            <p className="text-sm text-muted-foreground">Unable to load queue information</p>
          ) : queueSummary ? (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{Number(queueSummary.totalOrders)}</p>
                  <p className="text-sm text-muted-foreground">Orders in queue</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{formatWaitTime(queueSummary.estimatedWaitTime)}</p>
                  <p className="text-sm text-muted-foreground">Estimated wait</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No queue data available</p>
          )}
        </CardContent>
      </Card>

      {/* Menu Items by Category */}
      <div className="space-y-8">
        {categories.map((category) => {
          const items = menuItems.filter((item) => item.category === category);
          return (
            <section key={category} className="space-y-4">
              <div className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">{category}</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <div className="flex flex-col items-end gap-1">
                          {item.prices.hot && (
                            <Badge variant="outline" className="text-xs">
                              Hot: {item.prices.hot}
                            </Badge>
                          )}
                          {item.prices.ice && (
                            <Badge variant="outline" className="text-xs">
                              Ice: {item.prices.ice}
                            </Badge>
                          )}
                          {item.prices.default && (
                            <Badge variant="default" className="text-xs">
                              {item.prices.default}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
