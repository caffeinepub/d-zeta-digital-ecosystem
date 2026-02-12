import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Award, User } from 'lucide-react';
import MembershipProfileForm from '../components/MembershipProfileForm';
import LoyaltyPointsPanel from '../components/LoyaltyPointsPanel';
import LoyaltyRedemptionPanel from '../components/LoyaltyRedemptionPanel';

export default function LoyaltyPage() {
  return (
    <div className="container px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Loyalty "Warlok"</h1>
        <p className="text-muted-foreground text-lg">
          Join our local membership program and enjoy exclusive benefits
        </p>
      </div>

      <Tabs defaultValue="membership" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="membership">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="points">
            <Award className="mr-2 h-4 w-4" />
            Points
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <Gift className="mr-2 h-4 w-4" />
            Rewards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="membership">
          <MembershipProfileForm />
        </TabsContent>

        <TabsContent value="points">
          <LoyaltyPointsPanel />
        </TabsContent>

        <TabsContent value="rewards">
          <LoyaltyRedemptionPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
