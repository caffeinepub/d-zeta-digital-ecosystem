import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllArtifacts, useGetAllDistricts, useGetCurrentMetrics } from '../hooks/useQueries';
import { Loader2, MapPin, Leaf, QrCode } from 'lucide-react';
import OriginMapSection from '../components/OriginMapSection';
import SocialImpactMeter from '../components/SocialImpactMeter';

export default function MiniMuseumPage() {
  const navigate = useNavigate();
  const { data: artifacts, isLoading: artifactsLoading } = useGetAllArtifacts();
  const { data: districts, isLoading: districtsLoading } = useGetAllDistricts();
  const { data: metrics, isLoading: metricsLoading } = useGetCurrentMetrics();

  return (
    <div className="min-h-screen">
      <div
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/dzeta-hero-bg.dim_1600x900.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        <div className="relative container h-full flex flex-col justify-end pb-8 px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Gastronomy Digital Tales</h1>
          <p className="text-white/90 text-lg">Discover stories behind every artifact</p>
        </div>
      </div>

      <div className="container px-4 py-8 space-y-12">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <QrCode className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Scan & Listen</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Scan QR codes around the venue to unlock audio stories and historical insights about our 1980s artifacts.
          </p>

          {artifactsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : artifacts && artifacts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {artifacts.map((artifact) => (
                <Card
                  key={artifact.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate({ to: `/museum/artifact/${artifact.id}` })}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{artifact.title}</CardTitle>
                    {artifact.audioUrl && (
                      <Badge variant="secondary" className="w-fit">
                        Audio Available
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{artifact.story}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No artifacts available yet. Check back soon!</p>
              </CardContent>
            </Card>
          )}
        </section>

        <Separator />

        <OriginMapSection />

        <Separator />

        <SocialImpactMeter />
      </div>
    </div>
  );
}
