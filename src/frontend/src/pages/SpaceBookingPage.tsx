import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Eye } from 'lucide-react';
import BookingCalendar from '../components/BookingCalendar';
import BookingRequestForm from '../components/BookingRequestForm';
import VirtualTourSection from '../components/VirtualTourSection';

export default function SpaceBookingPage() {
  return (
    <div className="container px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Smart Space Booking</h1>
        <p className="text-muted-foreground text-lg">
          Book our venue for intimate events, weddings, or corporate gatherings
        </p>
      </div>

      <Tabs defaultValue="booking" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="booking">
            <Calendar className="mr-2 h-4 w-4" />
            Book Space
          </TabsTrigger>
          <TabsTrigger value="tour">
            <Eye className="mr-2 h-4 w-4" />
            Virtual Tour
          </TabsTrigger>
        </TabsList>

        <TabsContent value="booking" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <BookingCalendar />
            <BookingRequestForm />
          </div>
        </TabsContent>

        <TabsContent value="tour">
          <VirtualTourSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
