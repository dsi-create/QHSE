import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/Icon";
import { Incident, IncidentPriority, User, IncidentType, Users } from '@/types';
import { showError, showSuccess } from '@/utils/toast';
import { locations } from '@/lib/locations';

interface PlanInterventionFormProps {
  onPlanIntervention: (intervention: Omit<Incident, 'id' | 'date_creation' | 'reported_by' | 'statut' | 'photo_urls'>) => void;
  currentUser: User;
  users: Users; // Pass users prop
}

export const PlanInterventionForm = ({ onPlanIntervention, currentUser, users }: PlanInterventionFormProps) => {
  const [type, setType] = useState<IncidentType | ''>('');
  const [lieu, setLieu] = useState('');
  const [priorite, setPriorite] = useState<IncidentPriority>('moyenne');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadlineHours, setDeadlineHours] = useState('24');
  const [description, setDescription] = useState('');

  const technicians = Object.entries(users).filter(([, user]) => user.role === 'technicien');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !lieu || !priorite || !assignedTo || !description) {
      showError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const deadline = new Date(Date.now() + parseInt(deadlineHours, 10) * 60 * 60 * 1000);

    onPlanIntervention({
      type: type as IncidentType,
      lieu,
      priorite,
      description,
      service: 'technique',
      assigned_to: assignedTo,
      deadline,
    });

    // Reset form
    setType('');
    setLieu('');
    setPriorite('moyenne');
    setAssignedTo('');
    setDeadlineHours('24');
    setDescription('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon name="CalendarPlus" className="text-orange-600 mr-2" />
          Planifier une Intervention Technique
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type d'Intervention</label>
              <Select onValueChange={(v) => setType(v as IncidentType)} value={type}>
                <SelectTrigger><SelectValue placeholder="Sélectionner le type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="electrique">⚡ Électrique</SelectItem>
                  <SelectItem value="plomberie">🔧 Plomberie</SelectItem>
                  <SelectItem value="climatisation">❄️ Climatisation</SelectItem>
                  <SelectItem value="equipement-medical">🏥 Équipement médical</SelectItem>
                  <SelectItem value="informatique">💻 Informatique</SelectItem>
                  <SelectItem value="maintenance-preventive">🔧 Maintenance préventive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
              <Select onValueChange={setLieu} value={lieu}>
                <SelectTrigger><SelectValue placeholder="Sélectionner le lieu" /></SelectTrigger>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
              <Select onValueChange={(v) => setPriorite(v as IncidentPriority)} value={priorite}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="faible">🟢 Faible</SelectItem>
                  <SelectItem value="moyenne">🟡 Moyenne</SelectItem>
                  <SelectItem value="haute">🟠 Haute</SelectItem>
                  <SelectItem value="critique">🔴 Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigner au Technicien</label>
              <Select onValueChange={setAssignedTo} value={assignedTo}>
                <SelectTrigger><SelectValue placeholder="Sélectionner le technicien" /></SelectTrigger>
                <SelectContent>
                  {technicians.map(([id, user]) => ( // Use id from entry
                    <SelectItem key={id} value={id}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Délai Souhaité (heures)</label>
              <Input type="number" value={deadlineHours} onChange={(e) => setDeadlineHours(e.target.value)} placeholder="Délai en heures" min="1" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description de l'Intervention</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez l'intervention technique à réaliser..." />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 hover:from-cyan-700 hover:via-blue-700 hover:to-teal-700 text-white">
            <Icon name="CalendarPlus" className="mr-2 h-4 w-4" />Planifier l'Intervention
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};