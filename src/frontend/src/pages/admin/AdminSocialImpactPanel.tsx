import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetCurrentMetrics, useUpdateMetric } from '../../hooks/useQueries';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

export default function AdminSocialImpactPanel() {
  const { data: metrics, isLoading } = useGetCurrentMetrics();
  const updateMetric = useUpdateMetric();

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !name || !value) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await updateMetric.mutateAsync({
        id,
        name,
        value: parseFloat(value),
      });
      toast.success('Metric updated successfully');
      setId('');
      setName('');
      setValue('');
    } catch (error) {
      toast.error('Failed to update metric');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Social Impact Meter</CardTitle>
          <CardDescription>Update daily environmental impact metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metricId">Metric ID *</Label>
                <Input
                  id="metricId"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="waste-processed"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metricName">Metric Name *</Label>
                <Input
                  id="metricName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Waste Processed (kg)"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metricValue">Value *</Label>
                <Input
                  id="metricValue"
                  type="number"
                  step="0.1"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="12.5"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={updateMetric.isPending}>
              {updateMetric.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Metric
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Metrics</CardTitle>
          <CardDescription>Today's impact data</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !metrics || metrics.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No metrics yet</p>
          ) : (
            <div className="space-y-2">
              {metrics.map((metric) => (
                <div key={metric.id} className="p-3 border rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">{metric.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {metric.id}</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{metric.value.toFixed(1)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
