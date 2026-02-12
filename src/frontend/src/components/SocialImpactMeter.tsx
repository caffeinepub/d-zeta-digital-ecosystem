import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCurrentMetrics } from '../hooks/useQueries';
import { Loader2, Leaf, TrendingUp } from 'lucide-react';

export default function SocialImpactMeter() {
  const { data: metrics, isLoading } = useGetCurrentMetrics();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Leaf className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Social Impact Meter</h2>
      </div>
      <p className="text-muted-foreground mb-6">
        Track our daily environmental impact. Every visit contributes to a more sustainable future.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {metric.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{metric.value.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground mt-2">Updated today</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
