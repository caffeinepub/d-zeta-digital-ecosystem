import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetLoyaltyRewards, useGetCurrentLoyaltyPoints, useRedeemLoyaltyPoints } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Loader2, Gift, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import LoginButton from './auth/LoginButton';

export default function LoyaltyRedemptionPanel() {
  const { identity } = useInternetIdentity();
  const { data: rewards, isLoading: rewardsLoading } = useGetLoyaltyRewards();
  const { data: pointsData } = useGetCurrentLoyaltyPoints();
  const redeemPoints = useRedeemLoyaltyPoints();

  const currentBalance = pointsData?.[1]?.pointsBalance || 0;

  const handleRedeem = async (rewardId: string, pointsCost: bigint) => {
    if (currentBalance < Number(pointsCost)) {
      toast.error('Insufficient points for this reward');
      return;
    }

    try {
      await redeemPoints.mutateAsync({ rewardId, pointsCost });
      toast.success('Reward redeemed successfully!');
    } catch (error) {
      toast.error('Failed to redeem reward');
    }
  };

  if (!identity) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Login Required</CardTitle>
          <CardDescription>Please login to redeem rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginButton />
        </CardContent>
      </Card>
    );
  }

  if (rewardsLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!rewards || rewards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
          <CardDescription>Redeem your points for exclusive rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No rewards available at the moment. Check back soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Gift className="h-4 w-4" />
        <AlertDescription>
          You have <strong>{currentBalance}</strong> points available to redeem
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2">
        {rewards.map((reward) => {
          const canAfford = currentBalance >= Number(reward.pointsCost);

          return (
            <Card key={reward.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-lg">{reward.name}</CardTitle>
                  <Badge variant={canAfford ? 'default' : 'secondary'}>
                    {reward.pointsCost.toString()} pts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleRedeem(reward.id, reward.pointsCost)}
                  disabled={!canAfford || redeemPoints.isPending}
                  className="w-full"
                >
                  {redeemPoints.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redeeming...
                    </>
                  ) : canAfford ? (
                    'Redeem Now'
                  ) : (
                    'Insufficient Points'
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
