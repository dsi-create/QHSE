import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/Icon";
import { QHSEDocument, DocumentType, DocumentStatus, User } from "@/types";
import { apiClient } from "@/integrations/api/client";
import { showSuccess, showError } from "@/utils/toast";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFilterAndSearch } from "@/components/shared/SearchAndFilter";
import { LoadingSpinner } from "@/components/shared/Loading";
import { DOCUMENT_TYPES, PROCESSUS_CODES, PROCESSUS_BY_CATEGORY, generateDocumentCode } from "@/lib/document-coding";

interface QHSEDocumentsListProps {
  currentUser?: { username: string; details: User } | null;
}

const documentTypeLabels: Record<DocumentType, string> = {
  procedure: "Procédure",
  instruction: "Instruction",
  registre: "Registre",
  rapport: "Rapport",
  audit: "Audit",
  formation: "Formation",
  autre: "Autre",
  POL: "Politique",
  PROC: "Procédure",
  PROT: "Protocole",
  FP: "Fiche de poste",
  FT: "Fiche technique",
  FORM: "Formulaire",
  ANN: "Annexe",
};

const statusLabels: Record<DocumentStatus, string> = {
  brouillon: "Brouillon",
  en_validation: "En validation",
  validé: "Validé",
  obsolète: "Obsolète",
  archivé: "Archivé",
};

const statusColors: Record<DocumentStatus, string> = {
  brouillon: "bg-gray-100 text-gray-700",
  en_validation: "bg-yellow-100 text-yellow-700",
  validé: "bg-green-100 text-green-700",
  obsolète: "bg-red-100 text-red-700",
  archivé: "bg-blue-100 text-blue-700",
};

export const QHSEDocumentsList = ({ currentUser }: QHSEDocumentsListProps) => {
  const [documents, setDocuments] = useState<QHSEDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<QHSEDocument | null>(null);

  // Vérifier si l'utilisateur peut valider des documents (seulement superviseur QHSE et superadmin)
  const canValidateDocuments = currentUser?.details.role === 'superviseur_qhse' || currentUser?.details.role === 'superadmin';

  const { filteredData: filteredDocuments, searchQuery, setSearchQuery } = useFilterAndSearch(
    documents,
    ['title', 'code', 'category', 'processus', 'sous_processus', 'description']
  );

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getQHSEDocuments();
      setDocuments(data.map((doc: any) => ({
        ...doc,
        created_at: new Date(doc.created_at),
        updated_at: new Date(doc.updated_at),
        validation_date: doc.validation_date ? new Date(doc.validation_date) : undefined,
        effective_date: doc.effective_date ? new Date(doc.effective_date) : undefined,
        review_date: doc.review_date ? new Date(doc.review_date) : undefined,
        validity_date: doc.validity_date ? new Date(doc.validity_date) : undefined,
        is_displayed: doc.is_displayed === 1 || doc.is_displayed === true,
      })));
    } catch (error: any) {
      showError("Erreur lors du chargement des documents: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (formData: FormData) => {
    try {
      await apiClient.createQHSEDocument(formData);
      showSuccess("Document créé avec succès");
      setIsDialogOpen(false);
      fetchDocuments();
    } catch (error: any) {
      showError("Erreur lors de la création: " + error.message);
    }
  };

  const handleUpdateStatus = async (id: string, status: DocumentStatus) => {
    try {
      await apiClient.updateQHSEDocument(id, { status });
      showSuccess("Statut mis à jour");
      fetchDocuments();
    } catch (error: any) {
      showError("Erreur lors de la mise à jour: " + error.message);
    }
  };

  const handleValidateDocument = async (id: string) => {
    if (!canValidateDocuments) {
      showError("Vous n'avez pas les permissions pour valider ce document. Seul le Service Qualité (QHSE) peut valider les documents.");
      return;
    }

    try {
      await apiClient.updateQHSEDocument(id, { status: 'validé' });
      showSuccess("Document validé avec succès");
      fetchDocuments();
    } catch (error: any) {
      showError("Erreur lors de la validation: " + error.message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Icon name="FileText" className="text-cyan-600 mr-2" />
          Gestion Documentaire (GED QHSE)
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 hover:from-cyan-700 hover:via-blue-700 hover:to-teal-700">
              <Icon name="Plus" className="mr-2 h-4 w-4" /> Nouveau Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau document</DialogTitle>
              <DialogDescription>
                Remplissez le formulaire ci-dessous pour créer un nouveau document QHSE.
              </DialogDescription>
            </DialogHeader>
            <DocumentForm onSubmit={handleCreateDocument} onCancel={() => setIsDialogOpen(false)} existingDocuments={documents} />
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
              <TableHead>Code</TableHead>
              <TableHead>Nom du document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Processus</TableHead>
              <TableHead>Sous-processus</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Date de validité</TableHead>
              <TableHead>Responsable révision</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Validé par</TableHead>
              <TableHead>Date validation</TableHead>
              <TableHead>Document affiché</TableHead>
              <TableHead>Lieu d'affichage</TableHead>
              <TableHead>Date Création</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length > 0 ? filteredDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.code || '-'}</TableCell>
                <TableCell className="font-medium">{doc.title}</TableCell>
                <TableCell>{documentTypeLabels[doc.document_type]}</TableCell>
                <TableCell>{doc.processus || '-'}</TableCell>
                <TableCell>{doc.sous_processus || '-'}</TableCell>
                <TableCell><Badge variant="outline">{doc.version}</Badge></TableCell>
                <TableCell>{doc.validity_date ? format(doc.validity_date, 'dd/MM/yyyy') : '-'}</TableCell>
                <TableCell>{doc.revision_responsible || '-'}</TableCell>
                <TableCell>
                  <Badge className={statusColors[doc.status]}>
                    {statusLabels[doc.status]}
                  </Badge>
                </TableCell>
                <TableCell>{doc.validated_by_name || doc.validated_by || '-'}</TableCell>
                <TableCell>{doc.validation_date ? format(doc.validation_date, 'dd/MM/yyyy HH:mm') : '-'}</TableCell>
                <TableCell>
                  {doc.is_displayed ? (
                    <Badge className="bg-green-100 text-green-700">Oui</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-700">Non</Badge>
                  )}
                </TableCell>
                <TableCell>{doc.display_location || '-'}</TableCell>
                <TableCell>{format(doc.created_at, 'dd/MM/yyyy')}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {doc.status === 'brouillon' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(doc.id, 'en_validation')}
                      >
                        Envoyer en validation
                      </Button>
                    )}
                    {doc.status === 'en_validation' && canValidateDocuments && (
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleValidateDocument(doc.id)}
                      >
                        <Icon name="Check" className="mr-1 h-4 w-4" />
                        Valider
                      </Button>
                    )}
                    {doc.file_path && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`http://localhost:3001${doc.file_path}`, '_blank')}
                      >
                        <Icon name="Download" className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={15} className="text-center py-8">
                  <Icon name="FileText" className="mx-auto text-4xl text-gray-300 mb-2" />
                  {searchQuery ? 'Aucun document ne correspond à votre recherche.' : 'Aucun document enregistré.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const DocumentForm = ({ onSubmit, onCancel, existingDocuments }: { onSubmit: (formData: FormData) => void; onCancel: () => void; existingDocuments: QHSEDocument[] }) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('PROC');
  const [processusCode, setProcessusCode] = useState('');
  const [processus, setProcessus] = useState('');
  const [sousProcessus, setSousProcessus] = useState('');
  const [category, setCategory] = useState('');
  const [version, setVersion] = useState('01');
  const [description, setDescription] = useState('');
  const [accessLevel, setAccessLevel] = useState<'public' | 'interne' | 'confidentiel'>('interne');
  const [validityDate, setValidityDate] = useState('');
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [displayLocation, setDisplayLocation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [autoGenerateCode, setAutoGenerateCode] = useState(true);

  // Générer automatiquement le code quand le processus ou le type change
  useEffect(() => {
    if (autoGenerateCode && processusCode && documentType) {
      const existingCodes = existingDocuments.map(doc => doc.code || '').filter(Boolean);
      const generatedCode = generateDocumentCode(processusCode, documentType, existingCodes);
      setCode(generatedCode);
    }
  }, [processusCode, documentType, autoGenerateCode, existingDocuments]);

  // Mettre à jour le processus quand le code processus change
  useEffect(() => {
    if (processusCode && PROCESSUS_CODES[processusCode as keyof typeof PROCESSUS_CODES]) {
      const processusInfo = PROCESSUS_CODES[processusCode as keyof typeof PROCESSUS_CODES];
      setProcessus(processusInfo.label);
      setCategory(processusInfo.category);
    }
  }, [processusCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('code', code);
    formData.append('document_type', documentType);
    formData.append('processus', processus);
    formData.append('sous_processus', sousProcessus);
    formData.append('category', category);
    formData.append('version', version);
    formData.append('description', description);
    formData.append('access_level', accessLevel);
    if (validityDate) {
      formData.append('validity_date', validityDate);
    }
    formData.append('is_displayed', isDisplayed.toString());
    formData.append('display_location', displayLocation);
    if (file) {
      formData.append('file', file);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Nom du document *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label>Code {autoGenerateCode && '(Généré automatiquement)'}</Label>
          <div className="flex gap-2">
            <Input 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              placeholder="Ex: QGR-PROC-001"
              disabled={autoGenerateCode}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAutoGenerateCode(!autoGenerateCode)}
            >
              {autoGenerateCode ? 'Manuel' : 'Auto'}
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Type de document *</Label>
          <Select value={documentType} onValueChange={(v) => setDocumentType(v as DocumentType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(DOCUMENT_TYPES).map(([key, docType]) => (
                <SelectItem key={key} value={docType.code as DocumentType}>
                  {docType.label} ({docType.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Processus/Thématique *</Label>
          <Select value={processusCode} onValueChange={setProcessusCode}>
            <SelectTrigger><SelectValue placeholder="Sélectionner un processus" /></SelectTrigger>
            <SelectContent>
              {Object.entries(PROCESSUS_BY_CATEGORY).map(([category, processusList]) => (
                <div key={category}>
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">{category}</div>
                  {processusList.map((proc) => (
                    <SelectItem key={proc.code} value={proc.code}>
                      {proc.label} ({proc.code})
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Processus</Label>
          <Input value={processus} onChange={(e) => setProcessus(e.target.value)} placeholder="Ex: Qualité et gestion des risques" disabled />
        </div>
        <div>
          <Label>Sous-processus</Label>
          <Input value={sousProcessus} onChange={(e) => setSousProcessus(e.target.value)} placeholder="Ex: Management" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Catégorie</Label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} disabled />
        </div>
        <div>
          <Label>Version</Label>
          <Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="01" />
        </div>
        <div>
          <Label>Date de validité</Label>
          <Input 
            type="date" 
            value={validityDate} 
            onChange={(e) => setValidityDate(e.target.value)} 
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Niveau d'accès</Label>
          <Select value={accessLevel} onValueChange={(v) => setAccessLevel(v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="interne">Interne</SelectItem>
              <SelectItem value="confidentiel">Confidentiel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Document affiché</Label>
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={isDisplayed}
              onChange={(e) => setIsDisplayed(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-600">Afficher ce document</span>
          </div>
        </div>
      </div>
      {isDisplayed && (
        <div>
          <Label>Lieu d'affichage</Label>
          <Input 
            value={displayLocation} 
            onChange={(e) => setDisplayLocation(e.target.value)} 
            placeholder="Ex: Hall d'entrée, Service QHSE..."
          />
        </div>
      )}
      <div>
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>
      <div>
        <Label>Fichier</Label>
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600">Créer</Button>
      </div>
    </form>
  );
};

