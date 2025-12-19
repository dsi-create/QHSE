import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/Icon";
import { PlannedTask, PlannedTaskStatus, Users, UserRole } from "@/types";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CreateTaskDialog } from './CreateTaskDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface TaskPlanningProps {
  tasks: PlannedTask[];
  users: Users;
  onAddTask: (task: Omit<PlannedTask, 'id' | 'created_by' | 'status' | 'created_at'>) => void;
  onDeleteTask: (taskId: string) => void;
  currentUserRole?: UserRole; // Ajouter le rôle de l'utilisateur actuel
}

const statusClasses: Record<PlannedTaskStatus, string> = {
  'à faire': "bg-gray-500",
  'en cours': "bg-blue-500",
  'terminé': "bg-green-500",
  'bloqué': "bg-red-500",
};

export const TaskPlanning = ({ tasks, users, onAddTask, onDeleteTask, currentUserRole }: TaskPlanningProps) => {
  // Seul le superviseur QHSE peut créer des tâches planifiées
  const canCreateTasks = currentUserRole === 'superviseur_qhse' || currentUserRole === 'superadmin';
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Icon name="CalendarPlus" className="text-cyan-600 mr-2" />
          Planification des Tâches
        </CardTitle>
        {canCreateTasks && <CreateTaskDialog users={users} onAddTask={onAddTask} />}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Assigné à</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length > 0 ? tasks.map(task => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{users[Object.keys(users).find(key => users[key].id === task.assigned_to)!]?.name || task.assigned_to}</TableCell>
                <TableCell>{format(task.due_date, 'PPP', { locale: fr })}</TableCell>
                <TableCell>
                  <Badge className={`${statusClasses[task.status]} hover:${statusClasses[task.status]}`}>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Icon name="X" className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer la tâche ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. Voulez-vous vraiment supprimer la tâche "{task.title}" ?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Non</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteTask(task.id)}>Oui, supprimer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Icon name="ClipboardCheck" className="mx-auto text-4xl text-gray-300 mb-2" />
                  Aucune tâche planifiée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};