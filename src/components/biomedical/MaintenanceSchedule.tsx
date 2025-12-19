import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/Icon";
import { MaintenanceTask, MaintenanceTaskStatus, MaintenanceTaskType, BiomedicalEquipment } from "@/types";
import { format } from 'date-fns';

const statusClasses: Record<MaintenanceTaskStatus, string> = {
  planifiée: "bg-blue-500",
  en_cours: "bg-yellow-500",
  terminée: "bg-green-500",
  annulée: "bg-gray-500",
};

const typeClasses: Record<MaintenanceTaskType, string> = {
  préventive: "border-green-500 text-green-500",
  curative: "border-red-500 text-red-500",
};

interface MaintenanceScheduleProps {
  tasks: MaintenanceTask[];
  equipment: BiomedicalEquipment[];
}

export const MaintenanceSchedule = ({ tasks, equipment }: MaintenanceScheduleProps) => {
  const getEquipmentName = (id: string) => equipment.find(e => e.id === id)?.name || 'Inconnu';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon name="Calendar" className="text-cyan-600 mr-2" />
          Plan de Maintenance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Équipement</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date Planifiée</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map(task => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{getEquipmentName(task.equipment_id)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={typeClasses[task.type]}>{task.type}</Badge>
                </TableCell>
                <TableCell>{format(task.scheduled_date, 'dd/MM/yyyy')}</TableCell>
                <TableCell>
                  <Badge className={`${statusClasses[task.status]} hover:${statusClasses[task.status]}`}>{task.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};