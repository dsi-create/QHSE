import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/Icon";
import { Audit, AuditType, AuditStatus } from "@/types";
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

const auditTypeLabels: Record<AuditType, string> = {
  interne: "Audit Interne",
  externe: "Audit Externe",
  certification: "Audit Certification",
  inspection: "Inspection",
};

const statusLabels: Record<AuditStatus, string> = {
  planifié: "Planifié",
  en_cours: "En cours",
  terminé: "Terminé",
  annulé: "Annulé",
};

const statusColors: Record<AuditStatus, string> = {
  planifié: "bg-blue-100 text-blue-700",
  en_cours: "bg-yellow-100 text-yellow-700",
  terminé: "bg-green-100 text-green-700",
  annulé: "bg-red-100 text-red-700",
};

export const AuditsList = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { filteredData: filteredAudits, searchQuery, setSearchQuery } = useFilterAndSearch(
    audits,
    ['title', 'scope', 'audited_department']
  );

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAudits();
      setAudits(data.map((audit: any) => ({
        ...audit,
        planned_date: new Date(audit.planned_date),
        actual_date: audit.actual_date ? new Date(audit.actual_date) : undefined,
        created_at: new Date(audit.created_at),
        updated_at: new Date(audit.updated_at),
      })));
    } catch (error: any) {
      showError("Erreur lors du chargement des audits: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAudit = async (auditData: any) => {
    try {
      await apiClient.createAudit(auditData);
      showSuccess("Audit créé avec succès");
      setIsDialogOpen(false);
      fetchAudits();
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
          <Icon name="ClipboardCheck" className="text-cyan-600 mr-2" />
          Audits & Inspections
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600">
              <Icon name="Plus" className="mr-2 h-4 w-4" /> Nouvel Audit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Programmer un nouvel audit</DialogTitle>
            </DialogHeader>
            <AuditForm onSubmit={handleCreateAudit} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher par titre, périmètre..."
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
              <TableHead>Type</TableHead>
              <TableHead>Date Planifiée</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Non-conformités</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAudits.length > 0 ? filteredAudits.map((audit) => (
              <TableRow key={audit.id}>
                <TableCell className="font-medium">{audit.title}</TableCell>
                <TableCell>{auditTypeLabels[audit.audit_type]}</TableCell>
                <TableCell>{format(audit.planned_date, 'dd/MM/yyyy')}</TableCell>
                <TableCell>{audit.audited_department || '-'}</TableCell>
                <TableCell>
                  <Badge variant={audit.non_conformities_count > 0 ? 'destructive' : 'default'}>
                    {audit.non_conformities_count}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[audit.status]}>
                    {statusLabels[audit.status]}
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
                  <Icon name="ClipboardCheck" className="mx-auto text-4xl text-gray-300 mb-2" />
                  {searchQuery ? 'Aucun audit ne correspond à votre recherche.' : 'Aucun audit programmé.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const AuditForm = ({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) => {
  const [title, setTitle] = useState('');
  const [auditType, setAuditType] = useState<AuditType>('interne');
  const [scope, setScope] = useState('');
  const [plannedDate, setPlannedDate] = useState('');
  const [auditedDepartment, setAuditedDepartment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      audit_type: auditType,
      scope,
      planned_date: plannedDate,
      audited_department: auditedDepartment,
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
          <Label>Type d'audit *</Label>
          <Select value={auditType} onValueChange={(v) => setAuditType(v as AuditType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(auditTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Date planifiée *</Label>
          <Input type="date" value={plannedDate} onChange={(e) => setPlannedDate(e.target.value)} required />
        </div>
      </div>
      <div>
        <Label>Périmètre *</Label>
        <Textarea value={scope} onChange={(e) => setScope(e.target.value)} required rows={3} />
      </div>
      <div>
        <Label>Département audité</Label>
        <Input value={auditedDepartment} onChange={(e) => setAuditedDepartment(e.target.value)} />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600">Créer</Button>
      </div>
    </form>
  );
};



