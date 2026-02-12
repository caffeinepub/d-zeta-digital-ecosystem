import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGetAllDistricts, useCreateDistrict, useUpdateDistrict } from '../../hooks/useQueries';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';

export default function AdminOriginMapPanel() {
  const { data: districts, isLoading } = useGetAllDistricts();
  const createDistrict = useCreateDistrict();

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [featuredProduct, setFeaturedProduct] = useState('');
  const [farmerPhotoUrl, setFarmerPhotoUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !name || !featuredProduct || !farmerPhotoUrl || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createDistrict.mutateAsync({
        id,
        name,
        featuredProduct,
        farmerPhotoUrl,
        description,
      });
      toast.success('District created successfully');
      setId('');
      setName('');
      setFeaturedProduct('');
      setFarmerPhotoUrl('');
      setDescription('');
    } catch (error) {
      toast.error('Failed to create district');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Origin Map Management</CardTitle>
          <CardDescription>Manage the 5 districts and their featured products</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="districtId">District ID *</Label>
                <Input
                  id="districtId"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="district-1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="districtName">District Name *</Label>
                <Input
                  id="districtName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Bojonggambir"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="featuredProduct">Featured Product *</Label>
                <Input
                  id="featuredProduct"
                  value={featuredProduct}
                  onChange={(e) => setFeaturedProduct(e.target.value)}
                  placeholder="Organic Tea"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farmerPhotoUrl">Farmer Photo URL *</Label>
                <Input
                  id="farmerPhotoUrl"
                  type="url"
                  value={farmerPhotoUrl}
                  onChange={(e) => setFarmerPhotoUrl(e.target.value)}
                  placeholder="https://example.com/farmer.jpg"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the district and its products..."
                rows={3}
                required
              />
            </div>

            <Button type="submit" disabled={createDistrict.isPending}>
              {createDistrict.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create District
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Districts</CardTitle>
          <CardDescription>Total: {districts?.length || 0} / 5</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !districts || districts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No districts yet</p>
          ) : (
            <div className="space-y-2">
              {districts.map((district) => (
                <div key={district.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{district.name}</p>
                  <p className="text-sm text-muted-foreground">{district.featuredProduct}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
