import { useGetCurrentMetrics } from '../../hooks/useQueries';
import { Leaf, MapPin, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function HomeLiveCounters() {
  const { data: metrics, isLoading, error } = useGetCurrentMetrics();

  // Fallback values matching the draft copy
  const defaultCounters = [
    {
      icon: Leaf,
      label: '520+ Kilogram Limbah Terolah',
      value: '520+',
      unit: 'kg',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: MapPin,
      label: '5 Kecamatan Mitra Lokal',
      value: '5',
      unit: 'Kecamatan',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      icon: Zap,
      label: '100% Listrik Terjamin (Backup System)',
      value: '100%',
      unit: 'Uptime',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  // If we have metrics from backend, we could map them here
  // For now, we use the draft simulation values
  const counters = defaultCounters;

  if (error) {
    // Gracefully show fallback on error
    return (
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {defaultCounters.map((counter, idx) => (
          <Card key={idx} className="border-2">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 rounded-full ${counter.bgColor} flex items-center justify-center mx-auto`}>
                  <counter.icon className={`h-8 w-8 ${counter.color}`} />
                </div>
                <div>
                  <p className={`text-4xl font-bold ${counter.color}`}>{counter.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{counter.unit}</p>
                </div>
                <p className="text-sm font-medium text-foreground leading-snug">
                  {counter.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {counters.map((counter, idx) => (
        <Card key={idx} className="border-2 hover:border-primary/50 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 rounded-full ${counter.bgColor} flex items-center justify-center mx-auto`}>
                <counter.icon className={`h-8 w-8 ${counter.color}`} />
              </div>
              <div>
                <p className={`text-4xl font-bold ${counter.color}`}>
                  {isLoading ? '...' : counter.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{counter.unit}</p>
              </div>
              <p className="text-sm font-medium text-foreground leading-snug">
                {counter.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
