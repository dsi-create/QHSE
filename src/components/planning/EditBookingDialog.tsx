import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Icon } from '@/components/Icon';
import { Room, Booking, Doctor } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Label } from '../ui/label';
import { showError } from '@/utils/toast';
import { bookingReasons } from '@/lib/data';

interface EditBookingDialogProps {
  booking: Booking;
  rooms: Room[];
  doctors: Doctor[];
  onUpdateBooking: (bookingId: string, updatedData: Omit<Booking, 'id' | 'booked_by' | 'created_at'>) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditBookingDialog = ({ booking, rooms, doctors, onUpdateBooking, isOpen, onOpenChange }: EditBookingDialogProps) => {
  const [title, setTitle] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [roomId, setRoomId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  useEffect(() => {
    if (booking) {
      const isCustomReason = !bookingReasons.includes(booking.title);
      setTitle(isCustomReason ? 'Autre' : booking.title);
      setCustomTitle(isCustomReason ? booking.title : '');
      setRoomId(booking.room_id);
      setDoctorId(booking.doctor_id || '');
      setDate(booking.start_time);
      setStartTime(format(booking.start_time, 'HH:mm'));
      setEndTime(format(booking.end_time, 'HH:mm'));
    }
  }, [booking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title === 'Autre' ? customTitle : title;

    if (!finalTitle || !roomId || !date || !startTime || !endTime) {
      showError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const finalStartTime = new Date(date);
    finalStartTime.setHours(startHour, startMinute, 0, 0);

    const [endHour, endMinute] = endTime.split(':').map(Number);
    let finalEndTime = new Date(date);
    finalEndTime.setHours(endHour, endMinute, 0, 0);

    if (finalStartTime >= finalEndTime) {
      showError("L'heure de fin doit être après l'heure de début.");
      return;
    }

    onUpdateBooking(booking.id, { title: finalTitle, room_id: roomId, start_time: finalStartTime, end_time: finalEndTime, doctor_id: doctorId || undefined, status: booking.status });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Modifier la Réservation</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select onValueChange={setTitle} value={title} required>
            <SelectTrigger><SelectValue placeholder="Objet de la réservation" /></SelectTrigger>
            <SelectContent>
              {bookingReasons.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          {title === 'Autre' && (
            <Input placeholder="Précisez l'objet" value={customTitle} onChange={e => setCustomTitle(e.target.value)} required />
          )}
          <Select onValueChange={setRoomId} value={roomId} required>
            <SelectTrigger><SelectValue placeholder="Sélectionner une salle" /></SelectTrigger>
            <SelectContent>
              {rooms.map(r => <SelectItem key={r.id} value={r.id}>{r.name} ({r.location})</SelectItem>)}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setDoctorId(value === 'none' ? '' : value)} value={doctorId}>
            <SelectTrigger><SelectValue placeholder="Affecter un médecin (optionnel)" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun médecin</SelectItem>
              {doctors.map(d => <SelectItem key={d.id} value={d.id}>{d.name} - {d.specialty}</SelectItem>)}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Icon name="Calendar" className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus /></PopoverContent>
          </Popover>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Heure de début</Label>
              <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Heure de fin</Label>
              <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
            </div>
          </div>
          <Button type="submit" className="w-full">Enregistrer les modifications</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};