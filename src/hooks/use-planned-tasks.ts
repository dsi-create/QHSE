import { useState, useEffect } from 'react';
import { PlannedTask, PlannedTaskStatus, User, Users } from '@/types';
import { apiClient } from '@/integrations/api/client';
import { showSuccess, showError } from '@/utils/toast';

interface UsePlannedTasksProps {
  currentUser: { username: string; details: User } | null;
  users: Users;
  addNotification: (userId: string, message: string, link?: string) => void;
}

export const usePlannedTasks = ({ currentUser, users, addNotification }: UsePlannedTasksProps) => {
  const [plannedTasks, setPlannedTasks] = useState<PlannedTask[]>([]);

  // Fetch planned tasks from API
  useEffect(() => {
    const fetchPlannedTasks = async () => {
      // Vérifier si l'utilisateur est connecté avant de faire la requête
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        setPlannedTasks([]);
        return;
      }

      // Vérifier aussi que le token est défini dans le client API
      apiClient.setToken(token);

      try {
        const data = await apiClient.getPlannedTasks();
        const fetchedTasks: PlannedTask[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          assigned_to: item.assigned_to,
          created_by: item.created_by,
          due_date: new Date(item.due_date),
          status: item.status as PlannedTaskStatus,
          created_at: new Date(item.created_at),
        }));
        setPlannedTasks(fetchedTasks);
      } catch (error: any) {
        // Ne pas afficher d'erreur si c'est juste une erreur d'authentification
        if (error.status !== 401 && error.status !== 403) {
          console.error("Error fetching planned tasks:", error.message);
          showError("Erreur lors du chargement des tâches planifiées.");
        }
      }
    };

    fetchPlannedTasks();
    const interval = setInterval(fetchPlannedTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  const addPlannedTask = async (task: Omit<PlannedTask, 'id' | 'created_by' | 'status' | 'created_at'>) => {
    if (!currentUser) {
      showError("Vous devez être connecté pour créer une tâche.");
      return;
    }

    // Seul le superviseur QHSE peut créer des tâches planifiées
    if (currentUser.details.role !== 'superviseur_qhse' && currentUser.details.role !== 'superadmin') {
      showError("Seul le superviseur QHSE peut créer des tâches planifiées.");
      return;
    }

    try {
      await apiClient.createPlannedTask({
        title: task.title,
        description: task.description,
        assigned_to: task.assigned_to,
        due_date: task.due_date.toISOString().split('T')[0], // Format date seulement
      });
      showSuccess(`Tâche "${task.title}" créée et assignée à ${users[Object.keys(users).find(key => users[key].id === task.assigned_to)!]?.name}.`);
      addNotification(task.assigned_to, `Nouvelle tâche planifiée: ${task.title}`);
    } catch (error: any) {
      console.error("Error adding planned task:", error.message);
      showError("Erreur lors de l'ajout de la tâche planifiée.");
    }
  };

  const updatePlannedTaskStatus = async (taskId: string, status: PlannedTaskStatus) => {
    try {
      await apiClient.updatePlannedTask(taskId, { status });
      showSuccess(`Le statut de la tâche a été mis à jour.`);
      const updatedTask = plannedTasks.find(t => t.id === taskId);
      if (updatedTask) {
        addNotification(updatedTask.created_by, `La tâche "${updatedTask.title}" est maintenant: ${status}`);
      }
    } catch (error: any) {
      console.error("Error updating planned task status:", error.message);
      showError("Erreur lors de la mise à jour du statut de la tâche.");
    }
  };

  const deletePlannedTask = async (taskId: string) => {
    try {
      await apiClient.deletePlannedTask(taskId);
      showSuccess("La tâche a été supprimée.");
      const taskToDelete = plannedTasks.find(t => t.id === taskId);
      if (taskToDelete) {
        addNotification(taskToDelete.assigned_to, `La tâche "${taskToDelete.title}" a été supprimée.`);
      }
    } catch (error: any) {
      console.error("Error deleting planned task:", error.message);
      showError("Erreur lors de la suppression de la tâche.");
    }
  };

  return {
    plannedTasks,
    setPlannedTasks,
    addPlannedTask,
    updatePlannedTaskStatus,
    deletePlannedTask,
  };
};