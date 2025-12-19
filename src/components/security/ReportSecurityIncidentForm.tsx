import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/Icon";
import { Incident, IncidentPriority, IncidentType } from "@/types";
import { showError, showSuccess } from "@/utils/toast";
import { locations } from "@/lib/locations";
import { ImageUpload } from '@/components/shared/ImageUpload';

interface ReportSecurityIncidentFormProps {
  onAddIncident: (incident: Omit<Incident, 'id' | 'date_creation' | 'reported_by' | 'photo_urls'>, files: File[]) => void;
}

export const ReportSecurityIncidentForm = ({ onAddIncident }: ReportSecurityIncidentFormProps) => {
  const [type, setType] = useState<IncidentType | ''>('');
  const [lieu, setLieu] = useState('');
  const [priorite, setPriorite] = useState<IncidentPriority>('moyenne');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !lieu || !priorite || !description) {
      showError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    onAddIncident({
      type: type as IncidentType,
      lieu,
      priorite,
      description,
      statut: 'nouveau',
      service: 'securite',
    }, photos);
    showSuccess("Incident de sécurité signalé avec succès.");
    // Reset form
    setType('');
    setLieu('');
    setPriorite('moyenne');
    setDescription('');
    setPhotos([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon name="AlertTriangle" className="text-red-600 mr-2" />
          Signaler un Incident de Sécurité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type d'Incident</label>
              <Select onValueChange={(v) => setType(v as IncidentType)} value={type}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="vol">🚨 Vol</SelectItem>
                  <SelectItem value="agression">🥊 Agression</SelectItem>
                  <SelectItem value="intrusion">🚫 Intrusion</SelectItem>
                  <SelectItem value="degradation">💥 Dégradation</SelectItem>
                  <SelectItem value="autre">❓ Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
              <Select onValueChange={setLieu} value={lieu}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un lieu" /></SelectTrigger>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
            <Select onValueChange={(v) => setPriorite(v as IncidentPriority)} value={priorite}>
              <SelectTrigger><SelectValue placeholder="Définir la priorité" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="faible">🟢 Faible</SelectItem>
                <SelectItem value="moyenne">🟡 Moyenne</SelectItem>
                <SelectItem value="haute">🟠 Haute</SelectItem>
                <SelectItem value="critique">🔴 Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description Détaillée</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez l'incident..." />
          </div>
          
          <ImageUpload onFilesChange={setPhotos} />

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
            <Icon name="PlusCircle" className="mr-2 h-4 w-4" />Signaler l'Incident
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};