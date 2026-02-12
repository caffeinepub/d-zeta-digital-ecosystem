import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, AlertTriangle } from 'lucide-react';

export default function AdminInventoryPanel() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Management
          </CardTitle>
          <CardDescription>Monitor stock levels and set low-stock alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Inventory management features coming soon. Contact support for manual inventory updates.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
