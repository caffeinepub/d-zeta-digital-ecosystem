import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetLoyaltyRewards, useAddLoyaltyReward } from '../../hooks/useQueries';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';

export default function AdminLoyaltyRewardsPanel() {
  const { data: rewards, isLoading } = useGetLoyaltyRewards();
  const addReward = useAddLoyaltyReward();

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [pointsCost, setPointsCost] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !name || !pointsCost) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await addReward.mutateAsync({
        id,
        name,
        pointsCost: BigInt(pointsCost),
      });
      toast.success('Reward added successfully');
      setId('');
      setName('');
      setPointsCost('');
    } catch (error) {
      toast.error('Failed to add reward');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Rewards</CardTitle>
          <CardDescription>Manage redeemable rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rewardId">Reward ID *</Label>
                <Input
                  id="rewardId"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="plant-1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rewardName">Reward Name *</Label>
                <Input
                  id="rewardName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ornamental Plant"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pointsCost">Points Cost *</Label>
                <Input
                  id="pointsCost"
                  type="number"
                  value={pointsCost}
                  onChange={(e) => setPointsCost(e.target.value)}
                  placeholder="100"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={addReward.isPending}>
              {addReward.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reward
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Rewards</CardTitle>
          <CardDescription>Total: {rewards?.length || 0}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !rewards || rewards.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No rewards yet</p>
          ) : (
            <div className="space-y-2">
              {rewards.map((reward) => (
                <div key={reward.id} className="p-3 border rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">{reward.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {reward.id}</p>
                  </div>
                  <p className="text-lg font-bold text-primary">{reward.pointsCost.toString()} pts</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
