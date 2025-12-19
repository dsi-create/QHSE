import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/Icon";
import { Doctor, Room, Booking } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AddBookingDialog } from '../planning/AddBookingDialog';

interface DoctorListProps {
  doctors: Doctor[];
  rooms: Room[];
  onAddBooking: (booking: Omit<Booking, 'id' | 'booked_by' | 'status' | 'created_at'>) => void;
}

export const DoctorList = ({ doctors, rooms, onAddBooking }: DoctorListProps) => {
  const [isAddBookingDialogOpen, setIsAddBookingDialogOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);

  const groupedBySpecialty = doctors.reduce((acc, doctor) => {
    const { specialty } = doctor;
    if (!acc[specialty]) {
      acc[specialty] = [];
    }
    acc[specialty].push(doctor);
    return acc;
  }, {} as Record<string, Doctor[]>);

  const handleOpenBookingDialog = (doctor: Doctor) => {
    setSelectedDoctorForBooking(doctor);
    setIsAddBookingDialogOpen(true);
  };

  const handleCloseBookingDialog = () => {
    setIsAddBookingDialogOpen(false);
    setSelectedDoctorForBooking(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon name="Stethoscope" className="text-blue-600 mr-2" />
          Annuaire du Personnel Médical
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(groupedBySpecialty).map(([specialty, doctorList]) => (
            <AccordionItem value={specialty} key={specialty}>
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                {specialty} ({doctorList.length})
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctorList.map(doctor => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">{doctor.name}</TableCell>
                        <TableCell><Badge variant="secondary">{doctor.status}</Badge></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Icon name="Menu" className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleOpenBookingDialog(doctor)}>
                                <Icon name="CalendarPlus" className="mr-2 h-4 w-4" /> Réserver une salle
                              </DropdownMenuItem>
                              {/* Ajoutez d'autres actions ici si nécessaire */}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
      {selectedDoctorForBooking && (
        <AddBookingDialog
          rooms={rooms}
          doctors={doctors}
          onAddBooking={onAddBooking}
          isOpen={isAddBookingDialogOpen}
          onOpenChange={handleCloseBookingDialog}
          initialData={{ roomId: '', startTime: new Date(), doctorId: selectedDoctorForBooking.id }}
        />
      )}
    </Card>
  );
};