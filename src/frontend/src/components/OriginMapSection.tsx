import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetAllDistricts } from '../hooks/useQueries';
import { Loader2, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function OriginMapSection() {
  const { data: districts, isLoading } = useGetAllDistricts();
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const selected = districts?.find((d) => d.id === selectedDistrict) || districts?.[0];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!districts || districts.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Origin Map</h2>
      </div>
      <p className="text-muted-foreground mb-6">
        Explore the 5 districts where our ingredients come from. Meet the local farmers and producers who make our menu possible.
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="relative">
          <img
            src="/assets/generated/dzeta-origin-map.dim_1200x800.png"
            alt="Origin Map"
            className="w-full h-auto rounded-lg border shadow-sm"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 border shadow-lg">
              <p className="text-sm font-medium text-center">Interactive District Map</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
            {districts.map((district) => (
              <button
                key={district.id}
                onClick={() => setSelectedDistrict(district.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selected?.id === district.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-card hover:bg-muted border-border'
                }`}
              >
                <p className="font-medium text-sm">{district.name}</p>
              </button>
            ))}
          </div>

          {selected && (
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{selected.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <Badge variant="outline">{selected.featuredProduct}</Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selected.farmerPhotoUrl && (
                  <img
                    src={selected.farmerPhotoUrl}
                    alt={`Farmer from ${selected.name}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <p className="text-sm leading-relaxed">{selected.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
