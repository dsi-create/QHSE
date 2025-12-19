import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/Icon";
import { Room, Booking, User, Doctor } from "@/types";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface GlobalRoomOverviewProps {
  rooms: Room[];
  bookings: Booking[];
  users: { [username: string]: User };
  doctors: Doctor[];
}

export const GlobalRoomOverview = ({ rooms, bookings, users, doctors }: GlobalRoomOverviewProps) => {
  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');

  const getBookingsForRoomAndDate = (roomId: string, date: Date) => {
    return bookings.filter(booking =>
      booking.room_id === roomId &&
      format(booking.start_time, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ).sort((a, b) => a.start_time.getTime() - b.start_time.getTime());
  };

  const getRoomStatus = (room: Room) => {
    const todaysBookings = getBookingsForRoomAndDate(room.id, now);
    const currentBooking = todaysBookings.find(booking => now >= booking.start_time && now < booking.end_time);
    return currentBooking ? { status: 'Occupée', variant: 'destructive', currentBooking } : { status: 'Libre', variant: 'default' };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center">
        <Icon name="LayoutGrid" className="text-blue-600 mr-3 h-8 w-8" />Vue Globale des Salles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => {
          const { status, variant, currentBooking } = getRoomStatus(room);
          const upcomingBookings = getBookingsForRoomAndDate(room.id, now).filter(b => b.start_time > now);

          return (
            <Card key={room.id} className="flex flex-col h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-semibold">{room.name}</CardTitle>
                <Badge variant={variant as "default" | "destructive"} className={cn(variant === 'default' && 'bg-green-500 hover:bg-green-500')}>
                  {status}
                </Badge>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-500 mb-4">{room.location}</p>
                
                {currentBooking && (
                  <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                    <p className="font-medium text-red-800">Actuellement occupée:</p>
                    <p className="text-sm text-red-700">{currentBooking.title}</p>
                    <p className="text-xs text-red-600">
                      {format(currentBooking.start_time, 'HH:mm')} - {format(currentBooking.end_time, 'HH:mm')}
                    </p>
                  </div>
                )}

                <h3 className="font-semibold text-gray-700 mb-2">Prochaines réservations aujourd'hui:</h3>
                {upcomingBookings.length > 0 ? (
                  <ul className="space-y-2">
                    {upcomingBookings.map(booking => {
                      const bookedByUser = Object.values(users).find(u => u.id === booking.booked_by);
                      const assignedDoctor = doctors.find(d => d.id === booking.doctor_id);
                      return (
                        <li key={booking.id} className="p-2 bg-gray-50 rounded-md border border-gray-200">
                          <p className="font-medium text-sm">{booking.title}</p>
                          <p className="text-xs text-gray-600">
                            {format(booking.start_time, 'HH:mm')} - {format(booking.end_time, 'HH:mm')}
                          </p>
                          <p className="text-xs text-gray-500">
                            Par: {bookedByUser?.name || 'Inconnu'}
                            {assignedDoctor && ` (Dr. ${assignedDoctor.name.split(' ').pop()})`}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Aucune réservation à venir pour aujourd'hui.</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};