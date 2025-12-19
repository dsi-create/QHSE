import { Room, Booking, User, Doctor } from '@/types';
import { format, setHours, setMinutes, getHours } from 'date-fns';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/Icon';

interface RoomScheduleMatrixProps {
  rooms: Room[];
  bookings: Booking[];
  users: { [username: string]: User };
  doctors: Doctor[];
  selectedDate: Date;
  onSelectSlot?: (roomId: string, startTime: Date) => void;
  onSelectBooking: (booking: Booking) => void;
  expiringBookingIds: Set<string>;
  preExpiringBookingIds: Set<string>;
}

export const RoomScheduleMatrix = ({ 
  rooms, 
  bookings, 
  users, 
  doctors, 
  selectedDate, 
  onSelectSlot, 
  onSelectBooking,
  expiringBookingIds, 
  preExpiringBookingIds 
}: RoomScheduleMatrixProps) => {
  // Hours from 6 to 22 (10 PM) to cover a wider range of daily bookings
  const timeSlots = Array.from({ length: 17 }, (_, i) => i + 6); 
  const lastHourInSlots = timeSlots[timeSlots.length - 1];

  const spannedCells = new Set<string>();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border sticky left-0 bg-gray-100 z-10">Heure</th>
            {rooms.map(room => (
              <th key={room.id} className="p-2 border min-w-[150px] text-sm font-semibold">{room.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(hour => {
            const slotTime = setMinutes(setHours(selectedDate, hour), 0);
            const slotLabel = format(slotTime, 'HH:mm');

            return (
              <tr key={slotLabel}>
                <td className="p-2 border font-mono text-sm sticky left-0 bg-white z-10">{slotLabel}</td>
                {rooms.map(room => {
                  const cellKey = `${room.id}-${hour}`;
                  if (spannedCells.has(cellKey)) {
                    return null;
                  }

                  const booking = bookings.find(b => 
                    b.room_id === room.id &&
                    getHours(b.start_time) === hour
                  );

                  if (booking) {
                    const durationMinutes = (booking.end_time.getTime() - booking.start_time.getTime()) / (1000 * 60);
                    const rowSpan = Math.max(1, Math.ceil(durationMinutes / 60));

                    for (let i = 1; i < rowSpan; i++) {
                      const nextHour = hour + i;
                      if (nextHour <= lastHourInSlots) { // Ensure spanned cells are within the defined time slots
                        spannedCells.add(`${room.id}-${nextHour}`);
                      }
                    }

                    const doctor = booking.doctor_id ? doctors.find(d => d.id === booking.doctor_id) : null;
                    const user = Object.values(users).find(u => u.id === booking.booked_by);
                    const isExpiring = expiringBookingIds.has(booking.id);
                    const isPreExpiring = preExpiringBookingIds.has(booking.id);

                    return (
                      <td 
                        key={room.id} 
                        rowSpan={rowSpan}
                        className={cn(
                          "p-1 border align-top transition-colors", 
                          {
                            'bg-red-100 border-red-500 animate-pulse': isExpiring,
                            'bg-yellow-100 border-yellow-500 animate-subtle-pulse': isPreExpiring,
                            'bg-blue-100 hover:bg-blue-200 cursor-pointer': !isExpiring && !isPreExpiring,
                          }
                        )}
                        onClick={() => onSelectBooking(booking)}
                      >
                        <div className={cn(
                          "text-xs text-left p-2 rounded-md h-full flex flex-col",
                          isExpiring ? 'bg-red-200' : isPreExpiring ? 'bg-yellow-200' : 'bg-blue-200'
                        )}>
                          <p className="font-bold truncate">{booking.title}</p>
                          {doctor && <p className="truncate text-blue-800">Dr. {doctor.name.split(' ').pop()}</p>}
                          <p className="truncate">Par: {user?.name || 'Inconnu'}</p>
                          <p className="font-mono mt-auto pt-1">{format(booking.start_time, 'HH:mm')} - {format(booking.end_time, 'HH:mm')}</p>
                        </div>
                      </td>
                    );
                  } else {
                    return (
                      <td 
                        key={room.id} 
                        className={cn(
                          "p-2 border h-16 transition-colors",
                          onSelectSlot 
                            ? "bg-green-50 hover:bg-green-100 cursor-pointer" 
                            : "bg-gray-50 cursor-default"
                        )}
                        onClick={onSelectSlot ? () => onSelectSlot(room.id, slotTime) : undefined}
                      >
                        <span className="text-gray-400 text-xs">
                          {onSelectSlot ? "Libre" : "—"}
                        </span>
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};