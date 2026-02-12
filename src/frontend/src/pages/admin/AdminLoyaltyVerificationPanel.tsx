import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetAllMemberships, useVerifyMembership } from '../../hooks/useQueries';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoyaltyVerificationPanel() {
  const { data: memberships, isLoading } = useGetAllMemberships();
  const verifyMembership = useVerifyMembership();

  const handleVerify = async (user: string, isVerified: boolean) => {
    try {
      await verifyMembership.mutateAsync({ user, isVerified });
      toast.success(isVerified ? 'Membership verified' : 'Membership rejected');
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loyalty Verification</CardTitle>
        <CardDescription>Review and verify membership requests</CardDescription>
      </CardHeader>
      <CardContent>
        {!memberships || memberships.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No membership requests</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Identity Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships.map(([principal, membership]) => (
                <TableRow key={principal.toString()}>
                  <TableCell className="font-medium">{membership.name}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {principal.toString().slice(0, 8)}...
                  </TableCell>
                  <TableCell>{membership.identityNumber || '-'}</TableCell>
                  <TableCell>
                    {membership.isVerified ? (
                      <Badge className="bg-green-500">Verified</Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {!membership.isVerified && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleVerify(principal.toString(), true)}
                          disabled={verifyMembership.isPending}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleVerify(principal.toString(), false)}
                          disabled={verifyMembership.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
