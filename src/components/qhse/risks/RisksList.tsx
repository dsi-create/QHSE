import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/Icon";
import { Risk, RiskCategory, RiskLevel, RiskStatus } from "@/types";
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

const categoryLabels: Record<RiskCategory, string> = {
  biologique: "Biologique",
  chimique: "Chimique",
  physique: "Physique",
  ergonomique: "Ergonomique",
  psychosocial: "Psychosocial",
  sécurité: "Sécurité",
  environnemental: "Environnemental",
  autre: "Autre",
};

const levelLabels: Record<RiskLevel, string> = {
  très_faible: "Très faible",
  faible: "Faible",
  moyen: "Moyen",
  élevé: "Élevé",
  très_élevé: "Très élevé",
};

const levelColors: Record<RiskLevel, string> = {
  très_faible: "bg-green-100 text-green-700",
  faible: "bg-blue-100 text-blue-700",
  moyen: "bg-yellow-100 text-yellow-700",
  élevé: "bg-orange-100 text-orange-700",
  très_élevé: "bg-red-100 text-red-700",
};

const statusLabels: Record<RiskStatus, string> = {
  identifié: "Identifié",
  évalué: "Évalué",
  en_traitement: "En traitement",
  traité: "Traité",
  surveillé: "Surveillé",
};

const statusColors: Record<RiskStatus, string> = {
  identifié: "bg-blue-100 text-blue-700",
  évalué: "bg-yellow-100 text-yellow-700",
  en_traitement: "bg-orange-100 text-orange-700",
  traité: "bg-green-100 text-green-700",
  surveillé: "bg-purple-100 text-purple-700",
};

export const RisksList = () => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { filteredData: filteredRisks, searchQuery, setSearchQuery } = useFilterAndSearch(
    risks,
    ['title', 'description', 'risk_category', 'risk_source']
  );

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getRisks();
      setRisks(data.map((risk: any) => ({
        ...risk,
        created_at: new Date(risk.created_at),
        updated_at: new Date(risk.updated_at),
        due_date: risk.due_date ? new Date(risk.due_date) : undefined,
        review_date: risk.review_date ? new Date(risk.review_date) : undefined,
        last_review_date: risk.last_review_date ? new Date(risk.last_review_date) : undefined,
      })));
    } catch (error: any) {
      showError("Erreur lors du chargement des risques: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRisk = async (riskData: any) => {
    try {
      await apiClient.createRisk(riskData);
      showSuccess("Risque créé avec succès");
      setIsDialogOpen(false);
      fetchRisks();
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
          <Icon name="AlertTriangle" className="text-cyan-600 mr-2" />
          Gestion des Risques
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600">
              <Icon name="Plus" className="mr-2 h-4 w-4" /> Nouveau Risque
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Identifier un nouveau risque</DialogTitle>
            </DialogHeader>
            <RiskForm onSubmit={handleCreateRisk} onCancel={() => setIsDialogOpen(false)} />
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
              <TableHead>Niveau</TableHead>
              <TableHead>Probabilité</TableHead>
              <TableHead>Sévérité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRisks.length > 0 ? filteredRisks.map((risk) => (
              <TableRow key={risk.id}>
                <TableCell className="font-medium">{risk.title}</TableCell>
                <TableCell>{categoryLabels[risk.risk_category]}</TableCell>
                <TableCell>
                  <Badge className={levelColors[risk.risk_level]}>
                    {levelLabels[risk.risk_level]}
                  </Badge>
                </TableCell>
                <TableCell>{risk.probability}</TableCell>
                <TableCell>{risk.severity}</TableCell>
                <TableCell>
                  <Badge className={statusColors[risk.status]}>
                    {statusLabels[risk.status]}
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
                  <Icon name="AlertTriangle" className="mx-auto text-4xl text-gray-300 mb-2" />
                  {searchQuery ? 'Aucun risque ne correspond à votre recherche.' : 'Aucun risque identifié.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const RiskForm = ({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [riskCategory, setRiskCategory] = useState<RiskCategory>('biologique');
  const [riskSource, setRiskSource] = useState('');
  const [probability, setProbability] = useState<'très_faible' | 'faible' | 'moyenne' | 'élevée' | 'très_élevée'>('moyenne');
  const [severity, setSeverity] = useState<'négligeable' | 'faible' | 'modérée' | 'importante' | 'critique'>('modérée');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('moyen');
  const [currentControls, setCurrentControls] = useState('');

  const calculateRiskLevel = () => {
    // Matrice de risque simplifiée
    const probMap: Record<string, number> = {
      très_faible: 1, faible: 2, moyenne: 3, élevée: 4, très_élevée: 5
    };
    const sevMap: Record<string, number> = {
      négligeable: 1, faible: 2, modérée: 3, importante: 4, critique: 5
    };
    
    const score = probMap[probability] * sevMap[severity];
    
    if (score <= 4) return 'très_faible';
    if (score <= 8) return 'faible';
    if (score <= 12) return 'moyen';
    if (score <= 16) return 'élevé';
    return 'très_élevé';
  };

  useEffect(() => {
    setRiskLevel(calculateRiskLevel());
  }, [probability, severity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      risk_category: riskCategory,
      risk_source: riskSource || null,
      probability,
      severity,
      risk_level: riskLevel,
      current_controls: currentControls || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Titre *</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label>Description *</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Catégorie *</Label>
          <Select value={riskCategory} onValueChange={(v) => setRiskCategory(v as RiskCategory)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Source du risque</Label>
          <Input value={riskSource} onChange={(e) => setRiskSource(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Probabilité *</Label>
          <Select value={probability} onValueChange={(v) => setProbability(v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="très_faible">Très faible</SelectItem>
              <SelectItem value="faible">Faible</SelectItem>
              <SelectItem value="moyenne">Moyenne</SelectItem>
              <SelectItem value="élevée">Élevée</SelectItem>
              <SelectItem value="très_élevée">Très élevée</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Sévérité *</Label>
          <Select value={severity} onValueChange={(v) => setSeverity(v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="négligeable">Négligeable</SelectItem>
              <SelectItem value="faible">Faible</SelectItem>
              <SelectItem value="modérée">Modérée</SelectItem>
              <SelectItem value="importante">Importante</SelectItem>
              <SelectItem value="critique">Critique</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Niveau de risque calculé</Label>
        <Badge className={levelColors[riskLevel]}>{levelLabels[riskLevel]}</Badge>
      </div>
      <div>
        <Label>Contrôles actuels</Label>
        <Textarea value={currentControls} onChange={(e) => setCurrentControls(e.target.value)} rows={3} />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600">Créer</Button>
      </div>
    </form>
  );
};

