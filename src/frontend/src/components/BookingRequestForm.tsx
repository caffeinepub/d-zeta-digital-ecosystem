import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRequestBooking } from '../hooks/useQueries';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import PackageCustomizer from './PackageCustomizer';

export default function BookingRequestForm() {
  const [dateTime, setDateTime] = useState('');
  const [zone, setZone] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const requestBooking = useRequestBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateTime || !zone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const packageInfo = selectedPackage
      ? `\nPackage: ${selectedPackage}\nAdd-ons: ${selectedAddOns.join(', ') || 'None'}`
      : '';

    try {
      await requestBooking.mutateAsync({
        dateTime,
        zone,
        notes: notes + packageInfo,
      });
      toast.success('Booking request submitted successfully!');
      setDateTime('');
      setZone('');
      setNotes('');
      setSelectedPackage('');
      setSelectedAddOns([]);
    } catch (error) {
      toast.error('Failed to submit booking request');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Booking</CardTitle>
        <CardDescription>Fill in the details for your event</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dateTime">Date & Time *</Label>
            <Input
              id="dateTime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zone">Zone *</Label>
            <Select value={zone} onValueChange={setZone} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="workspace">Workspace</SelectItem>
                <SelectItem value="quiet-room">Quiet Room</SelectItem>
                <SelectItem value="main-hall">Main Hall</SelectItem>
                <SelectItem value="garden">Garden Area</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <PackageCustomizer
            selectedPackage={selectedPackage}
            selectedAddOns={selectedAddOns}
            onPackageChange={setSelectedPackage}
            onAddOnsChange={setSelectedAddOns}
          />

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements or requests..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={requestBooking.isPending}>
            {requestBooking.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Booking Request'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
