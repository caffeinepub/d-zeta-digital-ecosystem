import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGetAllArtifacts, useCreateArtifact, useUpdateArtifact } from '../../hooks/useQueries';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';

export default function AdminMuseumContentPanel() {
  const { data: artifacts, isLoading } = useGetAllArtifacts();
  const createArtifact = useCreateArtifact();
  const updateArtifact = useUpdateArtifact();

  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !title || !story) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createArtifact.mutateAsync({
        id,
        title,
        story,
        audioUrl: audioUrl || undefined,
      });
      toast.success('Artifact created successfully');
      setId('');
      setTitle('');
      setStory('');
      setAudioUrl('');
    } catch (error) {
      toast.error('Failed to create artifact');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Museum Content Management</CardTitle>
          <CardDescription>Create and manage artifact stories</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id">Artifact ID *</Label>
                <Input
                  id="id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="unique-artifact-id"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Artifact title"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="story">Story *</Label>
              <Textarea
                id="story"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Tell the story of this artifact..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audioUrl">Audio URL (Optional)</Label>
              <Input
                id="audioUrl"
                type="url"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://example.com/audio.mp3"
              />
            </div>

            <Button type="submit" disabled={createArtifact.isPending}>
              {createArtifact.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Artifact
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Artifacts</CardTitle>
          <CardDescription>Total: {artifacts?.length || 0}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !artifacts || artifacts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No artifacts yet</p>
          ) : (
            <div className="space-y-2">
              {artifacts.map((artifact) => (
                <div key={artifact.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{artifact.title}</p>
                  <p className="text-sm text-muted-foreground">ID: {artifact.id}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
