import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Icon } from "@/components/Icon";
import { BiomedicalEquipment } from '@/types';
import { showSuccess, showError } from '@/utils/toast';
import { locations } from '@/lib/locations';
import { medicalEquipmentList } from '@/lib/equipmentList';

interface AddEquipmentDialogProps {
  onAddEquipment: (equipment: Omit<BiomedicalEquipment, 'id' | 'status' | 'last_maintenance' | 'next_maintenance' | 'model' | 'department' | 'created_at'>) => void;
}

export const AddEquipmentDialog = ({ onAddEquipment }: AddEquipmentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [customName, setCustomName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    const finalName = name === 'Autre' ? customName : name;
    if (!finalName || !serialNumber || !location) {
      showError('Veuillez remplir tous les champs.');
      return;
    }
    onAddEquipment({ name: finalName, serial_number: serialNumber, location });
    setName('');
    setCustomName('');
    setSerialNumber('');
    setLocation('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icon name="PlusCircle" className="mr-2 h-4 w-4" />
          Ajouter un Équipement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel équipement</DialogTitle>
          <DialogDescription>
            Renseignez les informations du nouvel équipement biomédical.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nom</Label>
            <Select onValueChange={setName} value={name}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un équipement" />
              </SelectTrigger>
              <SelectContent>
                {medicalEquipmentList.map(group => (
                  <SelectGroup key={group.label}>
                    <SelectLabel>{group.label}</SelectLabel>
                    {group.options.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectGroup>
                ))}
                <SelectGroup>
                  <SelectItem value="Autre">Autre (préciser)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {name === 'Autre' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customName" className="text-right">Préciser</Label>
              <Input id="customName" value={customName} onChange={(e) => setCustomName(e.target.value)} className="col-span-3" />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serial" className="text-right">N° de Série</Label>
            <Input id="serial" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">Localisation</Label>
            <Select onValueChange={setLocation} value={location}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un lieu" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(group => (
                  <SelectGroup key={group.label}>
                    <SelectLabel>{group.label}</SelectLabel>
                    {group.options.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};