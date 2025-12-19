import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/Icon";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { User, Incident, Visitor, PlannedTask, Booking, Notification, Users } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PortalProps {
  user: User;
  incidents: Incident[];
  visitors: Visitor[];
  plannedTasks: PlannedTask[];
  bookings: Booking[];
  notifications: Notification[];
  users?: Users;
  onNavigate: (tabId: string) => void;
}

// Portail Superviseur Agent de Sécurité
export const SuperviseurSecuritePortal = ({ user, incidents, visitors, plannedTasks, notifications, users, onNavigate }: PortalProps) => {
  const today = new Date();
  const todayStr = today.toDateString();
  
  const securityIncidents = incidents.filter(i => i.service === 'securite');
  const myAgents = users ? Object.values(users).filter(u => u.role === 'agent_securite') : [];
  const stats = {
    totalIncidents: securityIncidents.length,
    newIncidents: securityIncidents.filter(i => i.statut === 'nouveau').length,
    inProgress: securityIncidents.filter(i => i.statut === 'cours').length,
    todayVisitors: visitors.filter(v => new Date(v.entry_time).toDateString() === todayStr).length,
    myAgents: myAgents.length,
    pendingTasks: plannedTasks.filter(t => t.status === 'à faire').length,
  };

  return (
    <div className="space-y-8 fade-in">
      {/* En-tête personnalisé */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white p-8 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-3">
              <Icon name="ShieldCheck" className="text-4xl mr-3" />
              <h1 className="text-4xl font-bold">Portail Superviseur Sécurité</h1>
            </div>
            <p className="text-blue-100 text-xl">
              {user.civility} {user.first_name} {user.last_name}
            </p>
            <p className="text-blue-200 mt-2">
              {format(today, "EEEE d MMMM yyyy", { locale: fr })} - {format(today, "HH:mm")}
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Incidents" 
          value={stats.totalIncidents} 
          iconName="AlertCircle" 
          colorClass="bg-red-100 text-red-600"
          onClick={() => onNavigate('securityIncidents')}
        />
        <DashboardCard 
          title="Nouveaux" 
          value={stats.newIncidents} 
          iconName="Bell" 
          colorClass="bg-orange-100 text-orange-600"
          onClick={() => onNavigate('securityIncidents')}
        />
        <DashboardCard 
          title="Mes Agents" 
          value={stats.myAgents} 
          iconName="Users" 
          colorClass="bg-blue-100 text-blue-600"
          onClick={() => onNavigate('settings')}
        />
        <DashboardCard 
          title="Visiteurs Aujourd'hui" 
          value={stats.todayVisitors} 
          iconName="UserCheck" 
          colorClass="bg-green-100 text-green-600"
          onClick={() => onNavigate('visitorLog')}
        />
      </div>

      {/* Accès rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover cursor-pointer" onClick={() => onNavigate('dashboardSecurite')}>
          <CardContent className="p-6">
            <Icon name="LayoutDashboard" className="text-blue-600 mb-3 text-3xl" />
            <h3 className="font-semibold mb-2">Dashboard Sécurité</h3>
            <p className="text-sm text-gray-600">Vue d'ensemble sécurité</p>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer" onClick={() => onNavigate('securityIncidents')}>
          <CardContent className="p-6">
            <Icon name="ListChecks" className="text-red-600 mb-3 text-3xl" />
            <h3 className="font-semibold mb-2">Gestion Incidents</h3>
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



