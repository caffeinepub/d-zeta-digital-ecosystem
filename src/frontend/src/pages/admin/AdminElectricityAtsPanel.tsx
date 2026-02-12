import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, Info } from 'lucide-react';

export default function AdminElectricityAtsPanel() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Electricity & ATS Monitor
          </CardTitle>
          <CardDescription>Monitor automatic transfer switch status</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              ATS monitoring features coming soon. Manual monitoring recommended until integration is complete.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
