import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useGetCurrentLoyaltyPoints } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Loader2, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { format } from 'date-fns';
import LoginButton from './auth/LoginButton';

export default function LoyaltyPointsPanel() {
  const { identity } = useInternetIdentity();
  const { data, isLoading } = useGetCurrentLoyaltyPoints();

  if (!identity) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Login Required</CardTitle>
          <CardDescription>Please login to view your loyalty points</CardDescription>
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

  const [balance, profile] = data || [0, { pointsBalance: 0, transactions: [] }];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Your Points Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold text-primary">{profile.pointsBalance}</p>
          <p className="text-sm text-muted-foreground mt-2">Available points</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent points activity</CardDescription>
        </CardHeader>
        <CardContent>
          {profile.transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No transactions yet. Start earning points with your purchases!
            </p>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {profile.transactions.map((transaction, idx) => (
                  <div key={transaction.id.toString()}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {transaction.isRedemption ? (
                          <TrendingDown className="h-5 w-5 text-red-500 mt-0.5" />
                        ) : (
                          <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(Number(transaction.timestamp) / 1000000), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                      </div>
                      <Badge variant={transaction.isRedemption ? 'destructive' : 'default'}>
                        {transaction.isRedemption ? '-' : '+'}
                        {transaction.points.toString()}
                      </Badge>
                    </div>
                    {idx < profile.transactions.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
