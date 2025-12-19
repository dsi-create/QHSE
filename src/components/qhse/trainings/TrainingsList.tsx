import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/Icon";
import { Training, TrainingType, TrainingStatus } from "@/types";
import { apiClient } from "@/integrations/api/client";
import { showSuccess, showError } from "@/utils/toast";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFilterAndSearch } from "@/components/shared/SearchAndFilter";
import { LoadingSpinner } from "@/components/shared/Loading";

const trainingTypeLabels: Record<TrainingType, string> = {
  interne: "Interne",
  externe: "Externe",
  en_ligne: "En ligne",
  présentiel: "Présentiel",
};

const statusLabels: Record<TrainingStatus, string> = {
  planifiée: "Planifiée",
  en_cours: "En cours",
  terminée: "Terminée",
  annulée: "Annulée",
};

const statusColors: Record<TrainingStatus, string> = {
  planifiée: "bg-blue-100 text-blue-700",
  en_cours: "bg-yellow-100 text-yellow-700",
  terminée: "bg-green-100 text-green-700",
  annulée: "bg-red-100 text-red-700",
};

export const TrainingsList = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { filteredData: filteredTrainings, searchQuery, setSearchQuery } = useFilterAndSearch(
    trainings,
    ['title', 'category', 'description']
  );

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getTrainings();
      setTrainings(data.map((training: any) => ({
        ...training,
        planned_date: training.planned_date ? new Date(training.planned_date) : undefined,
        actual_date: training.actual_date ? new Date(training.actual_date) : undefined,
        created_at: new Date(training.created_at),
        updated_at: new Date(training.updated_at),
      })));
    } catch (error: any) {
      showError("Erreur lors du chargement des formations: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTraining = async (trainingData: any) => {
    try {
      await apiClient.createTraining(trainingData);
      showSuccess("Formation créée avec succès");
      setIsDialogOpen(false);
      fetchTrainings();
    } catch (error: any) {
      showError("Erreur lors de la création: " + error.message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Icon name="GraduationCap" className="text-cyan-600 mr-2" />
          Formations & Compétences
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600">
              <Icon name="Plus" className="mr-2 h-4 w-4" /> Nouvelle Formation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle formation</DialogTitle>
            </DialogHeader>
            <TrainingForm onSubmit={handleCreateTraining} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher par titre, catégorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date Planifiée</TableHead>
              <TableHead>Durée (h)</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrainings.length > 0 ? filteredTrainings.map((training) => (
              <TableRow key={training.id}>
                <TableCell className="font-medium">{training.title}</TableCell>
                <TableCell>{training.category}</TableCell>
                <TableCell>{trainingTypeLabels[training.training_type]}</TableCell>
                <TableCell>{training.planned_date ? format(training.planned_date, 'dd/MM/yyyy') : '-'}</TableCell>
                <TableCell>{training.duration_hours || '-'}</TableCell>
                <TableCell>
                  <Badge className={statusColors[training.status]}>
                    {statusLabels[training.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    <Icon name="Eye" className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Icon name="GraduationCap" className="mx-auto text-4xl text-gray-300 mb-2" />
                  {searchQuery ? 'Aucune formation ne correspond à votre recherche.' : 'Aucune formation enregistrée.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const TrainingForm = ({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [trainingType, setTrainingType] = useState<TrainingType>('interne');
  const [description, setDescription] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [plannedDate, setPlannedDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [certificateRequired, setCertificateRequired] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      category,
      training_type: trainingType,
      description,
      duration_hours: durationHours ? parseFloat(durationHours) : null,
      planned_date: plannedDate || null,
      location: location || null,
      max_participants: maxParticipants ? parseInt(maxParticipants) : null,
      certificate_required: certificateRequired,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Titre *</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Catégorie *</Label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div>
          <Label>Type *</Label>
          <Select value={trainingType} onValueChange={(v) => setTrainingType(v as TrainingType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(trainingTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Durée (heures)</Label>
          <Input type="number" step="0.5" value={durationHours} onChange={(e) => setDurationHours(e.target.value)} />
        </div>
        <div>
          <Label>Date planifiée</Label>
          <Input type="date" value={plannedDate} onChange={(e) => setPlannedDate(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Lieu</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div>
          <Label>Participants max</Label>
          <Input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="certificateRequired"
          checked={certificateRequired}
          onChange={(e) => setCertificateRequired(e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="certificateRequired">Certificat requis</Label>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600">Créer</Button>
      </div>
    </form>
  );
};



