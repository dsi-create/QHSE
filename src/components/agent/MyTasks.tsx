import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/Icon";
import { PlannedTask, PlannedTaskStatus } from "@/types";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MoreHorizontal } from "lucide-react";

interface MyTasksProps {
  tasks: PlannedTask[];
  onUpdateStatus: (taskId: string, status: PlannedTaskStatus) => void;
}

const statusClasses: Record<PlannedTaskStatus, string> = {
  'à faire': "bg-gray-500",
  'en cours': "bg-blue-500",
  'terminé': "bg-green-500",
  'bloqué': "bg-red-500",
};

export const MyTasks = ({ tasks, onUpdateStatus }: MyTasksProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon name="ClipboardList" className="text-blue-600 mr-2" />
          Mes Tâches Planifiées
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length > 0 ? tasks.map(task => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell className="text-sm text-gray-600 max-w-sm truncate">{task.description}</TableCell>
                <TableCell>{format(task.due_date, 'PPP', { locale: fr })}</TableCell>
                <TableCell>
                  <Badge className={`${statusClasses[task.status]} hover:${statusClasses[task.status]}`}>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={task.status === 'terminé'}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onUpdateStatus(task.id, 'en cours')} disabled={task.status === 'en cours'}>
                        <Icon name="Play" className="mr-2 h-4 w-4" /> Démarrer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(task.id, 'terminé')}>
                        <Icon name="Check" className="mr-2 h-4 w-4" /> Terminer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(task.id, 'bloqué')} className="text-red-600">
                        <Icon name="AlertTriangle" className="mr-2 h-4 w-4" /> Bloquer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Icon name="ClipboardCheck" className="mx-auto text-4xl text-gray-300 mb-2" />
                  Aucune tâche planifiée pour le moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};