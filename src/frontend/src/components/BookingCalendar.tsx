import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { addDays, format } from 'date-fns';

export default function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const availableDates = Array.from({ length: 30 }, (_, i) => addDays(new Date(), i));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Availability</CardTitle>
        <CardDescription>Select a date to see available time slots</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => date < new Date() || date > addDays(new Date(), 90)}
          className="rounded-md border"
        />

        {selectedDate && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">
              Available Slots for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'].map((time) => (
                <Badge key={time} variant="outline" className="justify-center py-2">
                  {time}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
