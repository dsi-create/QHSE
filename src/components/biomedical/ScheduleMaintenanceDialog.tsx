import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/Icon";
import { MaintenanceTask, MaintenanceTaskType, BiomedicalEquipment, Users } from '@/types';
import { showError } from '@/utils/toast';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ScheduleMaintenanceDialogProps {
  equipment: BiomedicalEquipment[];
  onScheduleTask: (task: Omit<MaintenanceTask, 'id' | 'status' | 'created_at'>) => void;
  users: Users; // Pass users prop
}

export const ScheduleMaintenanceDialog = ({ equipment, onScheduleTask, users }: ScheduleMaintenanceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [equipmentId, setEquipmentId] = useState('');
  const [type, setType] = useState<MaintenanceTaskType | ''>('');
  const [description, setDescription] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date>();

  const technicians = Object.entries(users).filter(([, user]) => user.role === 'technicien');

  const handleSubmit = () => {
    if (!equipmentId || !type || !description || !technicianId || !scheduledDate) {
      showError('Veuillez remplir tous les champs.');
      return;
    }
    onScheduleTask({
      equipment_id: equipmentId,
      type: type as MaintenanceTaskType,
      description,
      technician_id: technicianId,
      scheduled_date: scheduledDate,
    });
    setEquipmentId('');
    setType('');
    setDescription('');
    setTechnicianId('');
    setScheduledDate(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Icon name="CalendarPlus" className="mr-2 h-4 w-4" />
          Planifier une Tâche
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Planifier une tâche de maintenance</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Équipement</Label>
            <Select onValueChange={setEquipmentId} value={equipmentId}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un équipement" /></SelectTrigger>
              <SelectContent>{equipment.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Type de maintenance</Label>
            <Select onValueChange={(v) => setType(v as MaintenanceTaskType)} value={type}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="préventive">Préventive</SelectItem>
                <SelectItem value="curative">Curative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>Technicien</Label>
            <Select onValueChange={setTechnicianId} value={technicianId}>
              <SelectTrigger><SelectValue placeholder="Assigner à un technicien" /></SelectTrigger>
              <SelectContent>{technicians.map(([id, user]) => <SelectItem key={id} value={id}>{user.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date planifiée</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !scheduledDate && "text-muted-foreground"
                        )}
                    >
                        <Icon name="Calendar" className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, "dd/MM/yyyy") : <span>Choisir une date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Planifier</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};