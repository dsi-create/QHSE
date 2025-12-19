import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/Icon";
import { Incident, InterventionReport } from '@/types';
import { showError } from '@/utils/toast';

interface InterventionReportDialogProps {
  incident: Incident;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: Omit<InterventionReport, 'report_date' | 'technician_name'>) => void;
}

export const InterventionReportDialog = ({ incident, isOpen, onClose, onSubmit }: InterventionReportDialogProps) => {
  const [timeSpent, setTimeSpent] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState('');
  const [actionsTaken, setActionsTaken] = useState('');
  const [recommendations, setRecommendations] = useState('');

  const handleSubmit = () => {
    if (!timeSpent || !actionsTaken) {
      showError("Veuillez remplir le temps passé et les actions réalisées.");
      return;
    }
    onSubmit({
      time_spent: parseInt(timeSpent, 10),
      materials_used: materialsUsed,
      actions_taken: actionsTaken,
      recommendations,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Rapport d'Intervention - {incident.id}</DialogTitle>
          <DialogDescription>
            Détaillez les actions réalisées pour résoudre cet incident.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">Temps passé (min)</Label>
            <Input id="time" type="number" value={timeSpent} onChange={(e) => setTimeSpent(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="materials" className="text-right">Matériel utilisé</Label>
            <Input id="materials" value={materialsUsed} onChange={(e) => setMaterialsUsed(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="actions" className="text-right">Actions réalisées</Label>
            <Textarea id="actions" value={actionsTaken} onChange={(e) => setActionsTaken(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reco" className="text-right">Recommandations</Label>
            <Textarea id="reco" value={recommendations} onChange={(e) => setRecommendations(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" onClick={handleSubmit}>
            <Icon name="Save" className="mr-2 h-4 w-4" /> Soumettre le Rapport
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};