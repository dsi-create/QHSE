import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icon } from "@/components/Icon";
import { Incident, IncidentPriority, UserRole, Users } from '@/types';
import { showError } from '@/utils/toast';

interface AssignTicketDialogProps {
  incident: Incident;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (incidentId: string, assignedTo: string, priority: IncidentPriority, deadline: Date) => void;
  users: Users; // Pass users prop
}

export const AssignTicketDialog = ({ incident, isOpen, onClose, onAssign, users }: AssignTicketDialogProps) => {
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<IncidentPriority>(incident.priorite);
  const [deadlineHours, setDeadlineHours] = useState('24');

  const agents = useMemo(() => {
    const roleMap: Record<Incident['service'], UserRole> = {
      'securite': 'agent_securite',
      'entretien': 'agent_entretien',
      'technique': 'technicien'
    };
    const targetRole = roleMap[incident.service];
    return Object.entries(users).filter(([, user]) => user.role === targetRole);
  }, [incident.service, users]); // Add users to dependency array

  const handleSubmit = () => {
    if (!assignedTo || !priority || !deadlineHours) {
      showError("Veuillez remplir tous les champs.");
      return;
    }
    const deadline = new Date(Date.now() + parseInt(deadlineHours, 10) * 60 * 60 * 1000);
    onAssign(incident.id, assignedTo, priority, deadline);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assigner le Ticket {incident.id.substring(0,17)}</DialogTitle>
          <DialogDescription>
            Assignez ce ticket à un agent et définissez une priorité et un délai.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="agent" className="text-right">Agent</Label>
            <Select onValueChange={setAssignedTo} value={assignedTo}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner un agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map(([id, user]) => ( // Use id from entry, not username
                  <SelectItem key={id} value={id}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">Priorité</Label>
            <Select onValueChange={(v) => setPriority(v as IncidentPriority)} value={priority}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="faible">🟢 Faible</SelectItem>
                <SelectItem value="moyenne">🟡 Moyenne</SelectItem>
                <SelectItem value="haute">🟠 Haute</SelectItem>
                <SelectItem value="critique">🔴 Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline" className="text-right">Délai (heures)</Label>
            <Input id="deadline" type="number" value={deadlineHours} onChange={(e) => setDeadlineHours(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" onClick={handleSubmit}>
            <Icon name="UserCog" className="mr-2 h-4 w-4" /> Assigner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};