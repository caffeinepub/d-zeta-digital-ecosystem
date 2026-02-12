import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetAllBookings, useUpdateBookingStatus } from '../../hooks/useQueries';
import { BookingStatus } from '../../backend';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminBookingsPanel() {
  const { data: bookings, isLoading, refetch } = useGetAllBookings();
  const updateStatus = useUpdateBookingStatus();

  const handleStatusUpdate = async (user: string, bookingId: bigint, status: BookingStatus) => {
    try {
      await updateStatus.mutateAsync({ user, bookingId, status });
      toast.success('Booking status updated');
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const allBookings = bookings?.flatMap(([principal, userBookings]) =>
    userBookings.map((booking) => ({ principal, booking }))
  ) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Space Bookings</CardTitle>
            <CardDescription>Manage event booking requests</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {allBookings.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No booking requests</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allBookings.map(({ principal, booking }) => (
                <TableRow key={`${principal.toString()}-${booking.id.toString()}`}>
                  <TableCell className="font-medium">#{booking.id.toString()}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {principal.toString().slice(0, 8)}...
                  </TableCell>
                  <TableCell>{booking.dateTime}</TableCell>
                  <TableCell>{booking.zone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{booking.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={booking.status}
                      onValueChange={(value) =>
                        handleStatusUpdate(principal.toString(), booking.id, value as BookingStatus)
                      }
                      disabled={updateStatus.isPending}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={BookingStatus.RequestedAccess}>Requested</SelectItem>
                        <SelectItem value={BookingStatus.Confirmed}>Confirmed</SelectItem>
                        <SelectItem value={BookingStatus.Denied}>Denied</SelectItem>
                        <SelectItem value={BookingStatus.Completed}>Completed</SelectItem>
                        <SelectItem value={BookingStatus.Canceled}>Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
