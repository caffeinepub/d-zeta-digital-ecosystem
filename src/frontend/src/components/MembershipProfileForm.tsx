import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetCallerMembership, useCreateMembership } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import LoginButton from './auth/LoginButton';

export default function MembershipProfileForm() {
  const { identity } = useInternetIdentity();
  const { data: membership, isLoading } = useGetCallerMembership();
  const createMembership = useCreateMembership();

  const [name, setName] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await createMembership.mutateAsync({
        name,
        identityNumber: identityNumber || null,
        photoUrl: photoUrl || null,
      });
      toast.success('Membership profile created successfully!');
      setName('');
      setIdentityNumber('');
      setPhotoUrl('');
    } catch (error) {
      toast.error('Failed to create membership profile');
    }
  };

  if (!identity) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Login Required</CardTitle>
          <CardDescription>Please login to access loyalty membership</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginButton />
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (membership) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Your Membership</CardTitle>
              <CardDescription>Loyalty program status</CardDescription>
            </div>
            {membership.isVerified ? (
              <Badge className="bg-green-500">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Neighbor Price Active
              </Badge>
            ) : (
              <Badge variant="secondary">
                <Clock className="mr-1 h-3 w-3" />
                Verification Pending
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Name</Label>
            <p className="font-medium">{membership.name}</p>
          </div>

          {membership.identityNumber && (
            <div>
              <Label className="text-muted-foreground">Identity Number</Label>
              <p className="font-medium">{membership.identityNumber}</p>
            </div>
          )}

          {membership.isVip && (
            <Badge variant="outline" className="w-fit">
              VIP Member
            </Badge>
          )}

          {!membership.isVerified && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Your verification is pending review. You'll receive neighbor pricing once approved by our team.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Membership Profile</CardTitle>
        <CardDescription>
          Submit your details for verification to unlock neighbor pricing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="identityNumber">Identity Number (KTP)</Label>
            <Input
              id="identityNumber"
              value={identityNumber}
              onChange={(e) => setIdentityNumber(e.target.value)}
              placeholder="Enter your KTP number"
            />
            <p className="text-xs text-muted-foreground">
              Required for neighbor price verification
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoUrl">Photo URL (Optional)</Label>
            <Input
              id="photoUrl"
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <Button type="submit" className="w-full" disabled={createMembership.isPending}>
            {createMembership.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              'Create Membership Profile'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
