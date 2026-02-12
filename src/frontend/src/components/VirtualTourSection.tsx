import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Eye, Move } from 'lucide-react';

const zones = [
  { id: 'workspace', name: 'Workspace', panoramaUrl: null },
  { id: 'quiet-room', name: 'Quiet Room', panoramaUrl: null },
  { id: 'main-hall', name: 'Main Hall', panoramaUrl: null },
  { id: 'garden', name: 'Garden Area', panoramaUrl: null },
];

export default function VirtualTourSection() {
  const [selectedZone, setSelectedZone] = useState(zones[0]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            360° Virtual Tour
          </CardTitle>
          <CardDescription>
            Explore our venue from anywhere. Drag to look around each zone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {zones.map((zone) => (
              <Button
                key={zone.id}
                variant={selectedZone.id === zone.id ? 'default' : 'outline'}
                onClick={() => setSelectedZone(zone)}
              >
                {zone.name}
              </Button>
            ))}
          </div>

          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
            {selectedZone.panoramaUrl ? (
              <div className="w-full h-full">
                {/* Panorama viewer would go here */}
                <img
                  src={selectedZone.panoramaUrl}
                  alt={`${selectedZone.name} panorama`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <Move className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{selectedZone.name}</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  360° panorama coming soon. Contact us to schedule an in-person tour of this beautiful space.
                </p>
                <Badge variant="secondary" className="mt-4">
                  Panorama Not Available
                </Badge>
              </div>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> Use your mouse or touch to drag and explore the 360° view. Click on zones above to switch between different areas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
