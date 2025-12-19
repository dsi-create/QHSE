import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from '@/components/Icon';
import { Room, Booking, User, UserRole, Doctor } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AddBookingDialog } from './AddBookingDialog';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RoomScheduleMatrix } from './RoomScheduleMatrix';
import { BookingDetailsDialog } from './BookingDetailsDialog';
import { generateBookingReportPDF } from '@/utils/bookingPdfGenerator';
import { showSuccess } from '@/utils/toast';
import { EditBookingDialog } from './EditBookingDialog';
import { cn } from '@/lib/utils';
import { canManageBookings } from '@/lib/permissions';

interface RoomScheduleProps {
  rooms: Room[];
  bookings: Booking[];
  users: { [username: string]: User };
  doctors: Doctor[];
  onAddBooking: (booking: Omit<Booking, 'id' | 'booked_by' | 'status' | 'created_at'>) => void;
  updateBooking: (bookingId: string, updatedData: Omit<Booking, 'id' | 'booked_by' | 'created_at'>) => void;
  deleteBooking: (bookingId: string) => void;
  currentUserRole: UserRole;
  currentUser: User;
  currentUsername: string; // Added currentUsername prop
  expiringBookingIds: Set<string>;
  preExpiringBookingIds: Set<string>;
  onStartBooking: (bookingId: string, pin: string) => Promise<boolean>;
  onEndBooking: (bookingId: string) => void;
}

export const RoomSchedule = ({ rooms, bookings, users, doctors, onAddBooking, updateBooking, deleteBooking, currentUserRole, currentUser, currentUsername, expiringBookingIds, preExpiringBookingIds, onStartBooking, onEndBooking }: RoomScheduleProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('matrix');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBookingInfo, setNewBookingInfo] = useState<{ roomId: string; startTime: Date } | undefined>();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);

  const dailyBookings = bookings.filter(b => format(b.start_time, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'));

  const handleSelectSlot = (roomId: string, startTime: Date) => {
    setNewBookingInfo({ roomId, startTime });
    setIsAddDialogOpen(true);
  };

  const handleDeleteBooking = (bookingId: string) => {
    deleteBooking(bookingId);
    setSelectedBooking(null);
  };

  const handleOpenEditDialog = () => {
    setBookingToEdit(selectedBooking);
    setSelectedBooking(null);
  };

  const handleGenerateReport = async () => {
    await generateBookingReportPDF(dailyBookings, rooms, users, selectedDate);
    showSuccess("Le rapport PDF a été généré avec succès.");
  };

  const getBookingsForRoomAndDate = (roomId: string, date: Date) => {
    return bookings.filter(booking =>
      booking.room_id === roomId &&
      format(booking.start_time, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ).sort((a, b) => a.start_time.getTime() - b.start_time.getTime());
  };

  const isRoomOccupiedNow = (roomId: string) => {
    const now = new Date();
    if (format(selectedDate, 'yyyy-MM-dd') !== format(now, 'yyyy-MM-dd')) {
      return null;
    }
    const todaysBookings = getBookingsForRoomAndDate(roomId, now);
    return todaysBookings.some(booking => now >= booking.start_time && now < booking.end_time);
  };

  const selectedBookingUser = selectedBooking 
    ? Object.values(users).find(u => u.id === selectedBooking.booked_by) 
    : undefined;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Icon name="Calendar" className="text-blue-600 mr-2" />
          Planning des Salles
        </CardTitle>
        <div className="flex items-center space-x-2">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value: 'list' | 'matrix') => value && setViewMode(value)}>
            <ToggleGroupItem value="matrix" aria-label="Vue matrice"><Icon name="LayoutGrid" className="h-4 w-4" /></ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Vue liste"><Icon name="List" className="h-4 w-4" /></ToggleGroupItem>
          </ToggleGroup>
          {canManageBookings(currentUserRole) && (
            <>
              <Button variant="outline" onClick={handleGenerateReport}>
                <Icon name="Download" className="mr-2 h-4 w-4" /> Rapport
              </Button>
              <Button onClick={() => { setNewBookingInfo(undefined); setIsAddDialogOpen(true); }}>
                <Icon name="Plus" className="mr-2 h-4 w-4" /> Réserver
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-center space-x-4">
          <Button variant="outline" onClick={() => setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() - 1);
            return newDate;
          })}>
            <Icon name="ChevronLeft" className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold text-center min-w-[250px]">{format(selectedDate, 'PPP', { locale: fr })}</h3>
          <Button variant="outline" onClick={() => setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + 1);
            return newDate;
          })}>
            <Icon name="ChevronRight" className="h-4 w-4" />
          </Button>
        </div>

        {viewMode === 'matrix' ? (
          <RoomScheduleMatrix
            rooms={rooms}
            bookings={dailyBookings}
            users={users}
            doctors={doctors}
            selectedDate={selectedDate}
            onSelectSlot={canManageBookings(currentUserRole) ? handleSelectSlot : undefined}
            onSelectBooking={setSelectedBooking}
            expiringBookingIds={expiringBookingIds}
            preExpiringBookingIds={preExpiringBookingIds}
          />
        ) : (
          <div className="space-y-6">
            {rooms.map(room => {
              const isOccupied = isRoomOccupiedNow(room.id);
              return (
                <div key={room.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg mb-1">{room.name}</h4>
                      <p className="text-sm text-gray-500">{room.location}{room.doctor_in_charge && ` - ${room.doctor_in_charge}`}</p>
                    </div>
                    {isOccupied !== null && (
                      <Badge variant={isOccupied ? "destructive" : "default"} className={!isOccupied ? "bg-green-500" : ""}>
                        {isOccupied ? "Occupé" : "Libre"}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2 mt-3">
                    {getBookingsForRoomAndDate(room.id, selectedDate).length > 0 ? (
                      getBookingsForRoomAndDate(room.id, selectedDate).map(booking => (
                        <div
                          key={booking.id}
                          className={cn(
                            "p-3 rounded-r-md flex justify-between items-center group transition-transform hover:scale-[1.02] cursor-pointer",
                            expiringBookingIds.has(booking.id)
                              ? 'bg-red-100 border-l-4 border-red-500 animate-pulse'
                              : preExpiringBookingIds.has(booking.id)
                              ? 'bg-yellow-100 border-l-4 border-yellow-500 animate-subtle-pulse'
                              : 'bg-blue-50 border-l-4 border-blue-500'
                          )}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <div>
                            <p className="font-medium">{booking.title}</p>
                            <p className="text-sm text-gray-600">
                              {format(booking.start_time, 'HH:mm')} - {format(booking.end_time, 'HH:mm')} par {Object.values(users).find(u => u.id === booking.booked_by)?.name || 'Inconnu'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm pt-2">Aucune réservation pour cette salle à cette date.</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
      {canManageBookings(currentUserRole) && (
        <AddBookingDialog
          rooms={rooms}
          doctors={doctors}
          onAddBooking={onAddBooking}
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          initialData={newBookingInfo}
        />
      )}
      {selectedBooking && selectedBookingUser && (
        <BookingDetailsDialog
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          booking={selectedBooking}
          room={rooms.find(r => r.id === selectedBooking.room_id)!}
          user={selectedBookingUser}
          doctors={doctors}
          onDelete={handleDeleteBooking}
          onEdit={handleOpenEditDialog}
          onStartBooking={onStartBooking}
          onEndBooking={onEndBooking}
          currentUser={currentUser}
          currentUsername={currentUsername}
        />
      )}
      {canManageBookings(currentUserRole) && bookingToEdit && (
        <EditBookingDialog
          isOpen={!!bookingToEdit}
          onOpenChange={() => setBookingToEdit(null)}
          booking={bookingToEdit}
          rooms={rooms}
          doctors={doctors}
          onUpdateBooking={updateBooking}
        />
      )}
    </Card>
  );
};