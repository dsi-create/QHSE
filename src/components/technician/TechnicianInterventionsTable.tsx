import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@/components/Icon";
import { Incident, IncidentPriority, IncidentStatus } from "@/types";

const priorityClasses: Record<IncidentPriority, string> = {
  haute: "bg-red-500",
  moyenne: "bg-yellow-500",
  faible: "bg-green-500",
  critique: "bg-red-700",
};

interface TechnicianInterventionsTableProps {
  interventions: Incident[];
  onUpdateStatus: (incidentId: string, newStatus: IncidentStatus) => void;
  onOpenReportDialog: (incident: Incident) => void;
}

export const TechnicianInterventionsTable = ({ interventions, onUpdateStatus, onOpenReportDialog }: TechnicianInterventionsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon name="Wrench" className="text-orange-600 mr-2" />
          Mes Interventions Techniques
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interventions.length > 0 ? interventions.map(task => (
              <TableRow key={task.id}>
                <TableCell className="font-mono text-sm">{task.id.substring(0, 17)}</TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>{task.lieu}</TableCell>
                <TableCell>
                  <Badge className={`${priorityClasses[task.priorite]} hover:${priorityClasses[task.priorite]}`}>
                    {task.priorite}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="bg-blue-500 hover:bg-blue-600 transition-transform hover:scale-105"
                      onClick={() => onUpdateStatus(task.id, 'cours')}
                      disabled={task.statut === 'cours' || task.statut === 'traite'}
                    >
                      <Icon name="Play" className="mr-1 h-4 w-4" /> Démarrer
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 transition-transform hover:scale-105"
                      onClick={() => onOpenReportDialog(task)}
                      disabled={task.statut !== 'cours'}
                    >
                      <Icon name="ClipboardCheck" className="mr-1 h-4 w-4" /> Rapport
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Icon name="ClipboardCheck" className="mx-auto text-4xl text-gray-300 mb-2" />
                  Aucune intervention assignée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};