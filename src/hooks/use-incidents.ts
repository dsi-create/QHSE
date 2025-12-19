import { useState, useEffect } from 'react';
import { Incident, IncidentStatus, InterventionReport, IncidentPriority, Users, User } from '@/types';
import { apiClient } from '@/integrations/api/client';
import { showSuccess, showError } from '@/utils/toast';

interface UseIncidentsProps {
  currentUser: { username: string; details: User } | null;
  users: Users;
  addNotification: (userId: string, message: string, link?: string) => void;
}

export const useIncidents = ({ currentUser, users, addNotification }: UseIncidentsProps) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  // Fetch incidents from API
  useEffect(() => {
    const fetchIncidents = async () => {
      // Vérifier si l'utilisateur est connecté avant de faire la requête
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        setIncidents([]);
        return;
      }

      // Vérifier aussi que le token est défini dans le client API
      apiClient.setToken(token);

      try {
        const data = await apiClient.getIncidents();
        const fetchedIncidents: Incident[] = data.map((item: any) => ({
          id: item.id,
          type: item.type,
          description: item.description,
          date_creation: new Date(item.date_creation),
          reported_by: item.reported_by,
          statut: item.statut,
          priorite: item.priorite,
          service: item.service,
          lieu: item.lieu,
          photo_urls: Array.isArray(item.photo_urls) ? item.photo_urls : (item.photo_urls ? JSON.parse(item.photo_urls) : []),
          assigned_to: item.assigned_to,
          deadline: item.deadline ? new Date(item.deadline) : undefined,
          report: item.report ? (typeof item.report === 'string' ? JSON.parse(item.report) : item.report) : undefined,
        }));
        setIncidents(fetchedIncidents);
      } catch (error: any) {
        // Ne pas afficher d'erreur si c'est juste une erreur d'authentification
        if (error.status !== 401 && error.status !== 403) {
          console.error("Error fetching incidents:", error.message);
          showError("Erreur lors du chargement des incidents.");
        }
      }
    };

    fetchIncidents();
    // Polling toutes les 30 secondes au lieu de temps réel
    const interval = setInterval(fetchIncidents, 30000);
    return () => clearInterval(interval);
  }, []);

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (!files || files.length === 0) return [];

    try {
      const { urls } = await apiClient.uploadImages(files);
      return urls;
    } catch (error: any) {
      console.error("Error uploading images:", error.message);
      showError(`Erreur lors du téléchargement des images: ${error.message}`);
      return [];
    }
  };

  const addIncident = async (newIncident: Omit<Incident, 'id' | 'date_creation' | 'reported_by' | 'photo_urls'>, files: File[]) => {
    if (!currentUser) {
      showError("Vous devez être connecté pour signaler un incident.");
      return;
    }

    try {
      const photo_urls = await uploadImages(files);
      await apiClient.createIncident({
        ...newIncident,
        photo_urls,
      });

      showSuccess("L'incident a été signalé avec succès.");
      const supervisor = Object.values(users).find(u => u.role === 'superviseur_qhse');
      if (supervisor) {
        addNotification(supervisor.id, `Nouvel incident (${newIncident.type}) signalé par ${currentUser.details.first_name} ${currentUser.details.last_name}.`);
      }
    } catch (error: any) {
      console.error("Error adding incident:", error.message);
      showError("Erreur lors de l'ajout de l'incident.");
    }
  };

  const updateIncidentStatus = async (incidentId: string, newStatus: IncidentStatus) => {
    try {
      await apiClient.updateIncident(incidentId, { statut: newStatus });
      showSuccess(`Le statut du ticket a été mis à jour.`);
      const updatedIncident = incidents.find(i => i.id === incidentId);
      if (updatedIncident?.assigned_to) addNotification(updatedIncident.assigned_to, `Statut du ticket mis à jour: ${newStatus}`);
      const supervisor = Object.values(users).find(u => u.role === 'superviseur_qhse');
      if (supervisor) {
        addNotification(supervisor.id, `Statut du ticket ${incidentId.substring(0, 8)} mis à jour: ${newStatus}`);
      }
    } catch (error: any) {
      console.error("Error updating incident status:", error.message);
      showError("Erreur lors de la mise à jour du statut de l'incident.");
    }
  };

  const addInterventionReport = async (incidentId: string, report: Omit<InterventionReport, 'report_date' | 'technician_name'>) => {
    if (!currentUser) {
      showError("Vous devez être connecté pour soumettre un rapport.");
      return;
    }

    try {
      const fullReport: InterventionReport = {
        ...report,
        report_date: new Date(),
        technician_name: `${currentUser.details.first_name} ${currentUser.details.last_name}`,
      };

      await apiClient.updateIncident(incidentId, { statut: 'traite', report: fullReport });
      showSuccess(`Rapport d'intervention soumis.`);
      const supervisor = Object.values(users).find(u => u.role === 'superviseur_qhse');
      if (supervisor) {
        addNotification(supervisor.id, `Rapport soumis pour ticket ${incidentId.substring(0, 8)} par ${currentUser.details.first_name} ${currentUser.details.last_name}.`);
      }
    } catch (error: any) {
      console.error("Error adding intervention report:", error.message);
      showError("Erreur lors de l'ajout du rapport d'intervention.");
    }
  };

  const assignTicket = async (incidentId: string, assignedTo: string, priority: IncidentPriority, deadline: Date) => {
    if (!currentUser) {
      showError("Vous devez être connecté pour assigner un ticket.");
      return;
    }

    // Seul le superviseur QHSE peut assigner des tickets
    if (currentUser.details.role !== 'superviseur_qhse' && currentUser.details.role !== 'superadmin') {
      showError("Seul le superviseur QHSE peut assigner des tickets.");
      return;
    }

    try {
      await apiClient.updateIncident(incidentId, {
        assigned_to: assignedTo,
        priorite: priority,
        deadline: deadline.toISOString(),
        statut: 'attente'
      });

      const assignedUserName = users[Object.keys(users).find(key => users[key].id === assignedTo)!]?.name || 'un agent';
      showSuccess(`Ticket assigné à ${assignedUserName}.`);
      addNotification(assignedTo, `Nouveau ticket vous a été assigné: ${incidentId.substring(0, 8)}.`);
      const supervisor = Object.values(users).find(u => u.role === 'superviseur_qhse');
      if (supervisor) {
        addNotification(supervisor.id, `Ticket ${incidentId.substring(0, 8)} assigné à ${assignedUserName}.`);
      }
    } catch (error: any) {
      console.error("Error assigning ticket:", error.message);
      showError("Erreur lors de l'assignation du ticket.");
    }
  };

  const unassignTicket = async (incidentId: string) => {
    if (!currentUser) {
      showError("Vous devez être connecté pour désassigner un ticket.");
      return;
    }

    // Seul le superviseur QHSE peut désassigner des tickets
    if (currentUser.details.role !== 'superviseur_qhse' && currentUser.details.role !== 'superadmin') {
      showError("Seul le superviseur QHSE peut désassigner des tickets.");
      return;
    }

    try {
      await apiClient.updateIncident(incidentId, {
        assigned_to: null,
        deadline: null,
        statut: 'nouveau'
      });
      
      showSuccess(`Le ticket a été désassigné.`);
      const incidentToUnassign = incidents.find(i => i.id === incidentId);
      if (incidentToUnassign?.assigned_to) {
        addNotification(incidentToUnassign.assigned_to, `Un ticket vous a été retiré: ${incidentId.substring(0, 8)}.`);
      }
      const supervisor = Object.values(users).find(u => u.role === 'superviseur_qhse');
      if (supervisor) {
        addNotification(supervisor.id, `Un ticket ${incidentId.substring(0, 8)} a été désassigné.`);
      }
    } catch (error: any) {
      console.error("Error unassigning ticket:", error.message);
      showError("Erreur lors de la désassignation du ticket.");
    }
  };

  const planIntervention = async (intervention: Omit<Incident, 'id' | 'date_creation' | 'reported_by' | 'statut' | 'photo_urls'>) => {
    if (!currentUser) {
      showError("Vous devez être connecté pour planifier une intervention.");
      return;
    }

    // Seul le superviseur QHSE peut planifier des interventions
    if (currentUser.details.role !== 'superviseur_qhse' && currentUser.details.role !== 'superadmin') {
      showError("Seul le superviseur QHSE peut planifier des interventions.");
      return;
    }

    try {
      await apiClient.createIncident({
        type: intervention.type,
        description: intervention.description,
        priorite: intervention.priorite,
        service: intervention.service,
        lieu: intervention.lieu,
        photo_urls: [],
      });
      
      // Ensuite mettre à jour pour assigner
      const allIncidents = await apiClient.getIncidents();
      const created = allIncidents[allIncidents.length - 1]; // Dernier créé
      await apiClient.updateIncident(created.id, {
        assigned_to: intervention.assigned_to,
        deadline: intervention.deadline?.toISOString(),
        statut: 'attente'
      });

      const assignedUserName = users[Object.keys(users).find(key => users[key].id === intervention.assigned_to)!]?.name || 'un agent';
      showSuccess(`Intervention planifiée et assignée à ${assignedUserName}.`);
      if (intervention.assigned_to) {
        addNotification(intervention.assigned_to, `Nouvelle intervention planifiée pour vous: ${intervention.type}.`);
      }
    } catch (error: any) {
      console.error("Error planning intervention:", error.message);
      showError("Erreur lors de la planification de l'intervention.");
    }
  };

  return {
    incidents,
    setIncidents,
    addIncident,
    updateIncidentStatus,
    addInterventionReport,
    assignTicket,
    unassignTicket,
    planIntervention,
  };
};