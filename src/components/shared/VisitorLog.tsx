import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Icon } from "@/components/Icon";
import { Visitor, Doctor, Users } from "@/types";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { visitorDestinations, visitReasons } from '@/lib/data';
import { doctors } from '@/lib/doctors';

interface AddVisitorFormProps {
  onAddVisitor: (visitor: Omit<Visitor, 'id' | 'entry_time' | 'registered_by'>) => void;
  onClose: () => void;
  users: Users; // Pass users to AddVisitorForm
  doctors: Doctor[]; // Pass doctors to AddVisitorForm
}

const AddVisitorForm = ({ onAddVisitor, onClose, users, doctors }: AddVisitorFormProps) => {
  const [fullName, setFullName] = useState('');
  const [idDocument, setIdDocument] = useState('');
  const [reason, setReason] = useState('');
  const [destination, setDestination] = useState('');
  const [personToSee, setPersonToSee] = useState('');

  const staffList = [
    ...doctors.map(d => ({ value: d.name, label: `${d.name} (${d.specialty})` })),
    ...Object.values(users).map(u => ({ value: u.name, label: `${u.name} (${u.position})` }))
  ].sort((a, b) => a.label.localeCompare(b.label));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !idDocument || !reason || !destination || !personToSee) return;
    onAddVisitor({ full_name: fullName, id_document: idDocument, reason, destination, person_to_see: personToSee });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Nom complet du visiteur" value={fullName} onChange={e => setFullName(e.target.value)} required />
      <Input placeholder="Numéro de pièce d'identité" value={idDocument} onChange={e => setIdDocument(e.target.value)} required />
      <Select onValueChange={setReason} value={reason} required>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner le motif de la visite" />
        </SelectTrigger>
        <SelectContent>
          {visitReasons.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select onValueChange={setDestination} value={destination} required>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner la destination" />
        </SelectTrigger>
        <SelectContent>
          {visitorDestinations.map(group => (
            <SelectGroup key={group.label}>
              <SelectLabel>{group.label}</SelectLabel>
              {group.options.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={setPersonToSee} value={personToSee} required>
        <SelectTrigger>
          <SelectValue placeholder="Personne à rencontrer" />
        </SelectTrigger>
        <SelectContent>
          {staffList.map(staff => (
            <SelectItem key={staff.value} value={staff.value}>{staff.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" className="w-full">Enregistrer l'entrée</Button>
    </form>
  );
};

interface VisitorLogProps {
  visitors: Visitor[];
  onAddVisitor: (visitor: Omit<Visitor, 'id' | 'entry_time' | 'registered_by'>) => void;
  onSignOutVisitor: (visitorId: string) => void;
  users: Users; // Pass users to VisitorLog
  doctors: Doctor[]; // Pass doctors to VisitorLog
}

export const VisitorLog = ({ visitors, onAddVisitor, onSignOutVisitor, users, doctors }: VisitorLogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Icon name="BookUser" className="text-blue-600 mr-2" />
          <CardTitle>Registre des Visiteurs</CardTitle>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Icon name="Plus" className="mr-2 h-4 w-4" />Nouveau Visiteur</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enregistrer un nouveau visiteur</DialogTitle>
            </DialogHeader>
            <AddVisitorForm onAddVisitor={onAddVisitor} onClose={() => setIsDialogOpen(false)} users={users} doctors={doctors} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Pièce d'identité</TableHead>
              <TableHead>Motif</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Personne à voir</TableHead>
              <TableHead>Heure d'entrée</TableHead>
              <TableHead>Heure de sortie</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitors.map(visitor => (
              <TableRow key={visitor.id}>
                <TableCell>{visitor.full_name}</TableCell>
                <TableCell>{visitor.id_document}</TableCell>
                <TableCell>{visitor.reason}</TableCell>
                <TableCell>{visitor.destination}</TableCell>
                <TableCell>{visitor.person_to_see}</TableCell>
                <TableCell>{format(visitor.entry_time, 'Pp', { locale: fr })}</TableCell>
                <TableCell>{visitor.exit_time ? format(visitor.exit_time, 'Pp', { locale: fr }) : 'En visite'}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => onSignOutVisitor(visitor.id)}
                    disabled={!!visitor.exit_time}
                  >
                    <Icon name="LogOut" className="mr-1 h-4 w-4" />
                    Enregistrer la sortie
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};