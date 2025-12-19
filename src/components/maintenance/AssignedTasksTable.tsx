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

const statusClasses: Record<IncidentStatus, string> = {
  nouveau: "bg-blue-500",
  cours: "bg-yellow-500",
  traite: "bg-purple-500",
  resolu: "bg-green-500",
  attente: "bg-gray-500",
};

interface AssignedTasksTableProps {
  incidents: Incident[];
  onUpdateIncidentStatus: (incidentId: string, newStatus: IncidentStatus) => void;
}

const AssignedTasksTable = ({ incidents, onUpdateIncidentStatus }: AssignedTasksTableProps) => {
  const tasks = incidents.filter(i => i.service === 'entretien');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon name="ClipboardList" className="text-blue-600 mr-2" />
          Mes Tâches Assignées
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
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length > 0 ? tasks.map(task => (
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
                  <Badge className={`${statusClasses[task.statut]} hover:${statusClasses[task.statut]}`}>
                    {task.statut}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="bg-blue-500 hover:bg-blue-600 transition-transform hover:scale-105"
                      onClick={() => onUpdateIncidentStatus(task.id, 'cours')}
                      disabled={task.statut === 'cours' || task.statut === 'traite' || task.statut === 'resolu'}
                    >
                      <Icon name="Play" className="mr-1 h-4 w-4" /> Démarrer
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 transition-transform hover:scale-105"
                      onClick={() => onUpdateIncidentStatus(task.id, 'traite')}
                      disabled={task.statut !== 'cours'}
                    >
                      <Icon name="Check" className="mr-1 h-4 w-4" /> Terminer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Icon name="ClipboardCheck" className="mx-auto text-4xl text-gray-300 mb-2" />
                  Aucune tâche assignée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AssignedTasksTable;