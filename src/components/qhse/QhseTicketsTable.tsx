import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icon } from "@/components/Icon";
import { Incident, IncidentPriority, IncidentService, IncidentStatus, Users, UserRole } from "@/types";
import { format } from 'date-fns';
import { AssignTicketDialog } from './AssignTicketDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useFilterAndSearch } from "@/components/shared/SearchAndFilter";
import { LoadingSpinner } from "@/components/shared/Loading";

const priorityClasses: Record<IncidentPriority, string> = {
  haute: "bg-red-500",
  moyenne: "bg-yellow-500",
  faible: "bg-green-500",
  critique: "bg-red-700",
};

const statusClasses: Record<IncidentStatus, string> = {
  nouveau: "bg-blue-500",
  cours: "bg-yellow-500",
  traite: "bg-purple-500",
  resolu: "bg-green-500",
  attente: "bg-gray-500",
};

interface QhseTicketsTableProps {
  incidents: Incident[];
  onUpdateStatus: (incidentId: string, newStatus: IncidentStatus) => void;
  onAssignTicket: (incidentId: string, assignedTo: string, priority: IncidentPriority, deadline: Date) => void;
  onUnassignTicket: (incidentId: string) => void;
  users: Users;
  currentUserRole?: UserRole; // Ajouter le rôle de l'utilisateur actuel
}

export const QhseTicketsTable = ({ incidents, onUpdateStatus, onAssignTicket, onUnassignTicket, users, currentUserRole }: QhseTicketsTableProps) => {
  const [filterService, setFilterService] = useState<IncidentService | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<IncidentStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<IncidentPriority | 'all'>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Seul le superviseur QHSE peut assigner/désassigner des tickets
  const canAssignTickets = currentUserRole === 'superviseur_qhse' || currentUserRole === 'superadmin';

  // Utilisation du hook de recherche amélioré
  const { filteredData: searchedIncidents, searchQuery, setSearchQuery } = useFilterAndSearch(
    incidents,
    ['type', 'description', 'lieu', 'id']
  );

  const filteredIncidents = useMemo(() => {
    return searchedIncidents.filter(incident => {
      if (filterService !== 'all' && incident.service !== filterService) return false;
      if (filterStatus !== 'all' && incident.statut !== filterStatus) return false;
      if (filterPriority !== 'all' && incident.priorite !== filterPriority) return false;
      return true;
    });
  }, [searchedIncidents, filterService, filterStatus, filterPriority]);

  const handleAssign = (incidentId: string, assignedTo: string, priority: IncidentPriority, deadline: Date) => {
    onAssignTicket(incidentId, assignedTo, priority, deadline);
    setSelectedIncident(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon name="Ticket" className="text-blue-600 mr-2" />
          Traitement et Assignation des Tickets
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Barre de recherche améliorée */}
        <div className="mb-6">
          <div className="relative mb-4">
            <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par type, description, lieu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <Select onValueChange={(v) => setFilterService(v as any)} value={filterService}>
            <SelectTrigger><SelectValue placeholder="Tous les services" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les services</SelectItem>
              <SelectItem value="securite">Sécurité</SelectItem>
              <SelectItem value="entretien">Entretien</SelectItem>
              <SelectItem value="technique">Technique</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(v) => setFilterStatus(v as any)} value={filterStatus}>
            <SelectTrigger><SelectValue placeholder="Tous les statuts" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="nouveau">Nouveau</SelectItem>
              <SelectItem value="attente">En attente</SelectItem>
              <SelectItem value="cours">En cours</SelectItem>
              <SelectItem value="traite">Traité</SelectItem>
              <SelectItem value="resolu">Résolu</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(v) => setFilterPriority(v as any)} value={filterPriority}>
            <SelectTrigger><SelectValue placeholder="Toutes priorités" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes priorités</SelectItem>
              <SelectItem value="critique">Critique</SelectItem>
              <SelectItem value="haute">Haute</SelectItem>
              <SelectItem value="moyenne">Moyenne</SelectItem>
              <SelectItem value="faible">Faible</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Délai</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIncidents.length > 0 ? filteredIncidents.map(incident => (
              <TableRow key={incident.id}>
                <TableCell className="font-mono text-sm">
                  <Link to={`/incident/${incident.id}`} className="text-blue-600 hover:underline">
                    {incident.id.substring(0, 17)}
                  </Link>
                </TableCell>
                <TableCell>{incident.service}</TableCell>
                <TableCell><Badge className={`${priorityClasses[incident.priorite]} hover:${priorityClasses[incident.priorite]}`}>{incident.priorite}</Badge></TableCell>
                <TableCell><Badge className={`${statusClasses[incident.statut]} hover:${statusClasses[incident.statut]}`}>{incident.statut}</Badge></TableCell>
                <TableCell>{incident.assigned_to ? users[Object.keys(users).find(key => users[key].id === incident.assigned_to)!]?.name : 'Non assigné'}</TableCell>
                <TableCell>{incident.deadline ? format(incident.deadline, 'dd/MM HH:mm') : '-'}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    {canAssignTickets && (
                      <Button size="sm" onClick={() => setSelectedIncident(incident)} disabled={incident.statut !== 'nouveau'} className="transition-transform hover:scale-105">
                        <Icon name="UserCog" className="mr-1 h-4 w-4" /> Assigner
                      </Button>
                    )}
                    {canAssignTickets && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled={!incident.assigned_to || ['cours', 'traite', 'resolu'].includes(incident.statut)} 
                            className="transition-transform hover:scale-105 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          >
                            <Icon name="UserX" className="mr-1 h-4 w-4" /> Désassigner
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Désassigner le ticket ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action retirera l'assignation de {incident.assigned_to ? users[Object.keys(users).find(key => users[key].id === incident.assigned_to)!]?.name : 'l\'agent'} et remettra le ticket au statut "Nouveau". Voulez-vous continuer ?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onUnassignTicket(incident.id)} className="bg-red-600 hover:bg-red-700">
                              Oui, désassigner
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    {canAssignTickets && (
                      <Button size="sm" variant="secondary" onClick={() => onUpdateStatus(incident.id, 'resolu')} disabled={incident.statut !== 'traite'} className="transition-transform hover:scale-105">
                        <Icon name="CheckCheck" className="mr-1 h-4 w-4" /> Valider
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Icon name="Ticket" className="mx-auto text-4xl text-gray-300 mb-2" />
                  {searchQuery || filterService !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'
                    ? 'Aucun ticket ne correspond à votre recherche.' 
                    : 'Aucun ticket à afficher.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {selectedIncident && (
          <AssignTicketDialog
            incident={selectedIncident}
            isOpen={!!selectedIncident}
            onClose={() => setSelectedIncident(null)}
            onAssign={handleAssign}
            users={users}
          />
        )}
      </CardContent>
    </Card>
  );
};