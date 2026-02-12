import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useGetAvailablePackages, useGetPackageAddOns } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';

interface PackageCustomizerProps {
  selectedPackage: string;
  selectedAddOns: string[];
  onPackageChange: (packageId: string) => void;
  onAddOnsChange: (addOns: string[]) => void;
}

export default function PackageCustomizer({
  selectedPackage,
  selectedAddOns,
  onPackageChange,
  onAddOnsChange,
}: PackageCustomizerProps) {
  const { data: packages, isLoading: packagesLoading } = useGetAvailablePackages();
  const { data: addOns, isLoading: addOnsLoading } = useGetPackageAddOns();

  const toggleAddOn = (addOnId: string) => {
    if (selectedAddOns.includes(addOnId)) {
      onAddOnsChange(selectedAddOns.filter((id) => id !== addOnId));
    } else {
      onAddOnsChange([...selectedAddOns, addOnId]);
    }
  };

  if (packagesLoading || addOnsLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!packages || packages.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Customize Your Package</CardTitle>
        <CardDescription>Select a base package and optional add-ons</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="package">Base Package</Label>
          <Select value={selectedPackage} onValueChange={onPackageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a package" />
            </SelectTrigger>
            <SelectContent>
              {packages.map((pkg) => (
                <SelectItem key={pkg} value={pkg}>
                  {pkg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {addOns && addOns.length > 0 && (
          <div className="space-y-3">
            <Label>Add-ons</Label>
            <div className="space-y-2">
              {addOns.map((addOn) => (
                <div key={addOn.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={addOn.id}
                    checked={selectedAddOns.includes(addOn.id)}
                    onCheckedChange={() => toggleAddOn(addOn.id)}
                  />
                  <label
                    htmlFor={addOn.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {addOn.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
