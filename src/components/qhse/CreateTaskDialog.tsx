import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Icon } from '@/components/Icon';
import { PlannedTask, Users, UserRole } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Label } from '../ui/label';
import { showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

interface CreateTaskDialogProps {
  users: Users;
  onAddTask: (task: Omit<PlannedTask, 'id' | 'created_by' | 'status' | 'created_at'>) => void;
}

export const CreateTaskDialog = ({ users, onAddTask }: CreateTaskDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();

  const agentRoles: UserRole[] = ['agent_securite', 'agent_entretien', 'technicien'];
  const availableAgents = Object.entries(users).filter(([, user]) => agentRoles.includes(user.role));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !assignedTo || !dueDate) {
      showError("Veuillez remplir tous les champs.");
      return;
    }

    onAddTask({ title, description, assigned_to: assignedTo, due_date: dueDate });
    setIsOpen(false);
    // Reset form
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setDueDate(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><Icon name="Plus" className="mr-2 h-4 w-4" /> Planifier une tâche</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nouvelle Tâche Planifiée</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Titre de la tâche</Label>
            <Input placeholder="Ex: Ronde de sécurité" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea placeholder="Décrivez la tâche en détail..." value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div>
            <Label>Assigner à</Label>
            <Select onValueChange={setAssignedTo} value={assignedTo} required>
              <SelectTrigger><SelectValue placeholder="Sélectionner un agent" /></SelectTrigger>
              <SelectContent>
                {availableAgents.map(([id, user]) => ( // Use id from entry
                  <SelectItem key={id} value={id}>{user.name} ({user.position})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date d'échéance</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                  <Icon name="Calendar" className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus /></PopoverContent>
            </Popover>
          </div>
          <Button type="submit" className="w-full">Créer la tâche</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};