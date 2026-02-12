import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetArtifactById } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Play, Pause, Loader2, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function ArtifactDetailPage() {
  const { artifactId } = useParams({ from: '/museum/artifact/$artifactId' });
  const navigate = useNavigate();
  const { data: artifact, isLoading, error } = useGetArtifactById(artifactId);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current || !artifact?.audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !artifact) {
    return (
      <div className="container px-4 py-8">
        <Button variant="ghost" onClick={() => navigate({ to: '/museum' })} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Museum
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Artifact not found. The item you're looking for may have been removed or doesn't exist.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 max-w-3xl">
      <Button variant="ghost" onClick={() => navigate({ to: '/museum' })} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Museum
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-3xl">{artifact.title}</CardTitle>
            {artifact.audioUrl && (
              <Badge variant="secondary">Audio Story</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {artifact.audioUrl && (
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <audio
                ref={audioRef}
                src={artifact.audioUrl}
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
              />
              <Button
                onClick={toggleAudio}
                size="lg"
                className="w-full"
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Pause Audio Story
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Play Audio Story
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="prose prose-sm max-w-none">
            <p className="text-base leading-relaxed whitespace-pre-wrap">{artifact.story}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
