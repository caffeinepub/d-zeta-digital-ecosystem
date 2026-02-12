import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetAvailablePackages, useGetPackageAddOns, useAddPackage, useAddPackageAddOn } from '../../hooks/useQueries';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';

export default function AdminPackagesPanel() {
  const { data: packages, isLoading: packagesLoading } = useGetAvailablePackages();
  const { data: addOns, isLoading: addOnsLoading } = useGetPackageAddOns();
  const addPackage = useAddPackage();
  const addAddOn = useAddPackageAddOn();

  const [packageId, setPackageId] = useState('');
  const [packageName, setPackageName] = useState('');
  const [addOnId, setAddOnId] = useState('');
  const [addOnName, setAddOnName] = useState('');

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageId || !packageName) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await addPackage.mutateAsync({ packageId, packageName });
      toast.success('Package added successfully');
      setPackageId('');
      setPackageName('');
    } catch (error) {
      toast.error('Failed to add package');
    }
  };

  const handleAddAddOn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addOnId || !addOnName) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await addAddOn.mutateAsync({ id: addOnId, name: addOnName });
      toast.success('Add-on added successfully');
      setAddOnId('');
      setAddOnName('');
    } catch (error) {
      toast.error('Failed to add add-on');
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Packages</CardTitle>
          <CardDescription>Manage base event packages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddPackage} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="packageId">Package ID</Label>
              <Input
                id="packageId"
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                placeholder="dimsum-package"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="packageName">Package Name</Label>
              <Input
                id="packageName"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="Dimsum Ibu Package"
              />
            </div>
            <Button type="submit" disabled={addPackage.isPending} className="w-full">
              {addPackage.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Package
                </>
              )}
            </Button>
          </form>

          <div className="space-y-2 pt-4">
            <h4 className="font-semibold text-sm">Existing Packages</h4>
            {packagesLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : !packages || packages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No packages yet</p>
            ) : (
              <div className="space-y-1">
                {packages.map((pkg) => (
                  <div key={pkg} className="p-2 border rounded text-sm">
                    {pkg}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add-ons</CardTitle>
          <CardDescription>Manage optional add-on services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddAddOn} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="addOnId">Add-on ID</Label>
              <Input
                id="addOnId"
                value={addOnId}
                onChange={(e) => setAddOnId(e.target.value)}
                placeholder="photographer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addOnName">Add-on Name</Label>
              <Input
                id="addOnName"
                value={addOnName}
                onChange={(e) => setAddOnName(e.target.value)}
                placeholder="Professional Photographer"
              />
            </div>
            <Button type="submit" disabled={addAddOn.isPending} className="w-full">
              {addAddOn.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Add-on
                </>
              )}
            </Button>
          </form>

          <div className="space-y-2 pt-4">
            <h4 className="font-semibold text-sm">Existing Add-ons</h4>
            {addOnsLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : !addOns || addOns.length === 0 ? (
              <p className="text-sm text-muted-foreground">No add-ons yet</p>
            ) : (
              <div className="space-y-1">
                {addOns.map((addOn) => (
                  <div key={addOn.id} className="p-2 border rounded text-sm">
                    {addOn.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
