import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/Icon";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { User, Incident, PlannedTask, Notification, Users } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PortalProps {
  user: User;
  incidents: Incident[];
  plannedTasks: PlannedTask[];
  notifications: Notification[];
  users?: Users;
  onNavigate: (tabId: string) => void;
}

// Portail Superviseur Agent d'Entretien
export const SuperviseurEntretienPortal = ({ user, incidents, plannedTasks, notifications, users, onNavigate }: PortalProps) => {
  const today = new Date();
  const todayStr = today.toDateString();
  
  const maintenanceIncidents = incidents.filter(i => i.service === 'entretien');
  const myAgents = users ? Object.values(users).filter(u => u.role === 'agent_entretien') : [];
  const stats = {
    totalIncidents: maintenanceIncidents.length,
    newIncidents: maintenanceIncidents.filter(i => i.statut === 'nouveau').length,
    inProgress: maintenanceIncidents.filter(i => i.statut === 'cours').length,
    resolved: maintenanceIncidents.filter(i => i.statut === 'resolu').length,
    myAgents: myAgents.length,
    pendingTasks: plannedTasks.filter(t => t.status === 'à faire').length,
  };

  return (
    <div className="space-y-8 fade-in">
      {/* En-tête personnalisé */}
      <div className="bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 text-white p-8 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-3">
              <Icon name="SprayCan" className="text-4xl mr-3" />
              <h1 className="text-4xl font-bold">Portail Superviseur Entretien QHSE</h1>
            </div>
            <p className="text-green-100 text-xl">
              {user.civility} {user.first_name} {user.last_name}
            </p>
            <p className="text-green-200 mt-2">
              {format(today, "EEEE d MMMM yyyy", { locale: fr })} - {format(today, "HH:mm")}
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Tickets" 
          value={stats.totalIncidents} 
          iconName="Ticket" 
          colorClass="bg-blue-100 text-blue-600"
          onClick={() => onNavigate('qhseTickets')}
        />
        <DashboardCard 
          title="Nouveaux" 
          value={stats.newIncidents} 
          iconName="Bell" 
          colorClass="bg-orange-100 text-orange-600"
          onClick={() => onNavigate('qhseTickets')}
        />
        <DashboardCard 
          title="Mes Agents" 
          value={stats.myAgents} 
          iconName="Users" 
          colorClass="bg-green-100 text-green-600"
          onClick={() => onNavigate('settings')}
        />
        <DashboardCard 
          title="Résolus" 
          value={stats.resolved} 
          iconName="CheckCircle2" 
          colorClass="bg-teal-100 text-teal-600"
          onClick={() => onNavigate('maintenanceHistory')}
        />
      </div>

      {/* Accès rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover cursor-pointer" onClick={() => onNavigate('dashboardEntretien')}>
          <CardContent className="p-6">
            <Icon name="LayoutDashboard" className="text-green-600 mb-3 text-3xl" />
            <h3 className="font-semibold mb-2">Dashboard Entretien</h3>
            <p className="text-sm text-gray-600">Vue d'ensemble</p>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer" onClick={() => onNavigate('qhseTickets')}>
          <CardContent className="p-6">
            <Icon name="Ticket" className="text-blue-600 mb-3 text-3xl" />
            <h3 className="font-semibold mb-2">Gestion Tickets</h3>
            <p className="text-sm text-gray-600">Assigner et suivre</p>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer" onClick={() => onNavigate('planningTasks')}>
          <CardContent className="p-6">
            <Icon name="CalendarPlus" className="text-purple-600 mb-3 text-3xl" />
            <h3 className="font-semibold mb-2">Planning Tâches</h3>
            <p className="text-sm text-gray-600">Créer des tâches</p>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer" onClick={() => onNavigate('settings')}>
          <CardContent className="p-6">
            <Icon name="Settings" className="text-gray-600 mb-3 text-3xl" />
            <h3 className="font-semibold mb-2">Gestion Agents</h3>
            <p className="text-sm text-gray-600">Gérer les comptes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

