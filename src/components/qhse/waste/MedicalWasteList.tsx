import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/Icon";
import { MedicalWaste, WasteType, WasteStatus } from "@/types";
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

const wasteTypeLabels: Record<WasteType, string> = {
  DASRI: "DASRI",
  médicamenteux: "Médicamenteux",
  chimique: "Chimique",
  radioactif: "Radioactif",
  autre: "Autre",
};

const statusLabels: Record<WasteStatus, string> = {
  collecté: "Collecté",
  stocké: "Stocké",
  traité: "Traité",
  éliminé: "Éliminé",
};

const statusColors: Record<WasteStatus, string> = {
  collecté: "bg-blue-100 text-blue-700",
  stocké: "bg-yellow-100 text-yellow-700",
  traité: "bg-green-100 text-green-700",
  éliminé: "bg-gray-100 text-gray-700",
};

export const MedicalWasteList = () => {
  const [waste, setWaste] = useState<MedicalWaste[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { filteredData: filteredWaste, searchQuery, setSearchQuery } = useFilterAndSearch(
    waste,
    ['waste_type', 'category', 'collection_location', 'tracking_number']
  );

  useEffect(() => {
    fetchWaste();
  }, []);

  const fetchWaste = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getMedicalWaste();
      setWaste(data.map((w: any) => ({
        ...w,
        collection_date: new Date(w.collection_date),
        treatment_date: w.treatment_date ? new Date(w.treatment_date) : undefined,
        created_at: new Date(w.created_at),
        updated_at: new Date(w.updated_at),
        photo_urls: w.photo_urls ? (Array.isArray(w.photo_urls) ? w.photo_urls : JSON.parse(w.photo_urls)) : [],
      })));
    } catch (error: any) {
      showError("Erreur lors du chargement des déchets: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWaste = async (wasteData: any) => {
    try {
      await apiClient.createMedicalWaste(wasteData);
      showSuccess("Déchet enregistré avec succès");
      setIsDialogOpen(false);
      fetchWaste();
    } catch (error: any) {
      showError("Erreur lors de l'enregistrement: " + error.message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Icon name="Trash2" className="text-cyan-600 mr-2" />
          Suivi des Déchets Médicaux
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600">
              <Icon name="Plus" className="mr-2 h-4 w-4" /> Enregistrer Déchet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enregistrer un nouveau déchet</DialogTitle>
            </DialogHeader>
            <WasteForm onSubmit={handleCreateWaste} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher par type, lieu, numéro de suivi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Lieu de collecte</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Numéro de suivi</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWaste.length > 0 ? filteredWaste.map((w) => (
              <TableRow key={w.id}>
                <TableCell>
                  <Badge>{wasteTypeLabels[w.waste_type]}</Badge>
                </TableCell>
                <TableCell>{w.quantity} {w.unit}</TableCell>
                <TableCell>{w.collection_location}</TableCell>
                <TableCell>{format(w.collection_date, 'dd/MM/yyyy')}</TableCell>
                <TableCell className="font-mono text-sm">{w.tracking_number || '-'}</TableCell>
                <TableCell>
                  <Badge className={statusColors[w.status]}>
                    {statusLabels[w.status]}
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
                  <Icon name="Trash2" className="mx-auto text-4xl text-gray-300 mb-2" />
                  {searchQuery ? 'Aucun déchet ne correspond à votre recherche.' : 'Aucun déchet enregistré.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const WasteForm = ({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) => {
  const [wasteType, setWasteType] = useState<WasteType>('DASRI');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<'kg' | 'litre' | 'unité'>('kg');
  const [collectionDate, setCollectionDate] = useState('');
  const [collectionLocation, setCollectionLocation] = useState('');
  const [wasteCode, setWasteCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      waste_type: wasteType,
      category: category || null,
      quantity: parseFloat(quantity),
      unit,
      collection_date: collectionDate,
      collection_location: collectionLocation,
      waste_code: wasteCode || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Type de déchet *</Label>
          <Select value={wasteType} onValueChange={(v) => setWasteType(v as WasteType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(wasteTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Catégorie</Label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Quantité *</Label>
          <Input type="number" step="0.01" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        </div>
        <div>
          <Label>Unité *</Label>
          <Select value={unit} onValueChange={(v) => setUnit(v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="litre">Litre</SelectItem>
              <SelectItem value="unité">Unité</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Lieu de collecte *</Label>
        <Input value={collectionLocation} onChange={(e) => setCollectionLocation(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Date de collecte *</Label>
          <Input type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} required />
        </div>
        <div>
          <Label>Code déchet</Label>
          <Input value={wasteCode} onChange={(e) => setWasteCode(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600">Enregistrer</Button>
      </div>
    </form>
  );
};



