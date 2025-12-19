import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/Icon";
import { Booking, Room, User, Doctor } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PinValidationDialog } from "./PinValidationDialog";

interface BookingDetailsDialogProps {
  booking: Booking;
  room: Room;
  user: User; // The user who booked the room
  doctors: Doctor[];
  isOpen: boolean;
  onClose: () => void;
  onDelete: (bookingId: string) => void;
  onEdit: () => void;
  onStartBooking: (bookingId: string, pin: string) => Promise<boolean>;
  onEndBooking: (bookingId: string) => void;
  currentUser: User; // The currently logged-in user
  currentUsername: string; // The username of the currently logged-in user
}

export const BookingDetailsDialog = ({
  booking,
  room,
  user, // The user who made the booking
  doctors,
  isOpen,
  onClose,
  onDelete,
  onEdit,
  onStartBooking,
  onEndBooking,
  currentUser, // The currently logged-in user
  currentUsername, // The username of the currently logged-in user
}: BookingDetailsDialogProps) => {
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const assignedDoctor = doctors.find(d => d.id === booking.doctor_id);

  // Check if the current user is the one who made the booking
  const isCurrentUserBookingOwner = currentUser.id === booking.booked_by;

  // Check if the current user has general management roles (only Secretary can manage bookings)
  const canManageAnyBooking = ['secretaire'].includes(currentUser.role);

  // Seule la secrétaire peut modifier/supprimer les réservations
  const canModifyOrDelete = canManageAnyBooking;

  // Find the Doctor object corresponding to the currentUser, if the currentUser is a 'medecin'
  const currentUserDoctorProfile = currentUser.role === 'medecin' 
    ? doctors.find(d => d.name === currentUser.name) 
    : undefined;

  // A doctor can start/end a booking if they are the assigned doctor AND the current user is a doctor
  const isCurrentUserTheAssignedDoctor = assignedDoctor?.id === currentUserDoctorProfile?.id && currentUser.role === 'medecin';


  const handleStartWithPin = async (pin: string) => {
    const success = await onStartBooking(booking.id, pin);
    if (success) {
      onClose();
    }
    return success;
  };

  const handleEnd = () => {
    onEndBooking(booking.id);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{booking.title}</DialogTitle>
            <DialogDescription>
              Détails de la réservation - Statut : <span className="font-semibold">{booking.status}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center">
              <Icon name="Calendar" className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <p className="font-medium">Date et Heure</p>
                <p className="text-sm text-gray-600">
                  {format(booking.start_time, "PPP", { locale: fr })} de{" "}
                  {format(booking.start_time, "HH:mm")} à{" "}
                  {format(booking.end_time, "HH:mm")}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Icon name="MapPin" className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <p className="font-medium">Salle</p>
                <p className="text-sm text-gray-600">
                  {room.name} ({room.location})
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Icon name="User" className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <p className="font-medium">Réservé par</p>
                <p className="text-sm text-gray-600">{user.name}</p>
              </div>
            </div>
            {assignedDoctor && (
              <div className="flex items-center">
                <Icon name="Stethoscope" className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Médecin affecté</p>
                  <p className="text-sm text-gray-600">{assignedDoctor.name}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-between flex-wrap">
            <div className="flex gap-2">
              {isCurrentUserTheAssignedDoctor && booking.status === 'réservé' && (
                <Button onClick={() => setIsPinDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                  <Icon name="Play" className="mr-2 h-4 w-4" /> Démarrer
                </Button>
              )}
              {isCurrentUserTheAssignedDoctor && booking.status === 'en_cours' && (
                <Button onClick={handleEnd} className="bg-red-600 hover:bg-red-700">
                  <Icon name="Check" className="mr-2 h-4 w-4" /> Terminer
                </Button>
              )}
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              {canModifyOrDelete && (
                <Button variant="outline" onClick={onEdit}>
                  <Icon name="Pencil" className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              )}
              {canModifyOrDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Icon name="X" className="mr-2 h-4 w-4" />
                      Annuler
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Annuler la réservation ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Voulez-vous vraiment annuler
                        cette réservation ?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Non</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(booking.id)}>
                        Oui, annuler
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <PinValidationDialog
        isOpen={isPinDialogOpen}
        onClose={() => setIsPinDialogOpen(false)}
        onValidate={handleStartWithPin}
      />
    </>
  );
};