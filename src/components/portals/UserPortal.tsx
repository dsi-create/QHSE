import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/Icon";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { User, Incident, Visitor, PlannedTask, Booking, Notification } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PortalProps {
  user: User;
  incidents: Incident[];
  visitors: Visitor[];
  plannedTasks: PlannedTask[];
  bookings: Booking[];
  notifications: Notification[];
  onNavigate: (tabId: string) => void;
}

// Composant générique pour les portails
export const UserPortal = ({ user, incidents, visitors, plannedTasks, bookings, notifications, onNavigate }: PortalProps) => {
  const today = new Date();
  const todayStr = today.toDateString();
  
  // Statistiques communes
  const todayIncidents = incidents.filter(i => new Date(i.date_creation).toDateString() === todayStr);
  const todayVisitors = visitors.filter(v => new Date(v.entry_time).toDateString() === todayStr);
  const myTasks = plannedTasks.filter(t => t.assigned_to === user.id && t.status === 'à faire');
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-8 fade-in">
      {/* En-tête du portail */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bienvenue, {user.civility} {user.first_name} {user.last_name}
            </h1>
            <p className="text-cyan-100 text-lg">
              {format(today, "EEEE d MMMM yyyy", { locale: fr })} - {user.service || 'Centre Diagnostic Libreville'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{format(today, "HH:mm")}</div>
            <div className="text-cyan-100">{unreadNotifications > 0 && `${unreadNotifications} notification(s)`}</div>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Incidents Aujourd'hui" 
          value={todayIncidents.length} 
          iconName="AlertCircle" 
          colorClass="bg-blue-100 text-blue-600"
          onClick={() => onNavigate('securityIncidents')}
        />
        <DashboardCard 
          title="Visiteurs Aujourd'hui" 
          value={todayVisitors.length} 
          iconName="Users" 
          colorClass="bg-green-100 text-green-600"
          onClick={() => onNavigate('visitorLog')}
        />
        <DashboardCard 
          title="Mes Tâches" 
          value={myTasks.length} 
          iconName="ClipboardList" 
          colorClass="bg-purple-100 text-purple-600"
          onClick={() => onNavigate('myTasks')}
        />
        <DashboardCard 
          title="Notifications" 
          value={unreadNotifications} 
          iconName="Bell" 
          colorClass="bg-orange-100 text-orange-600"
        />
      </div>

      {/* Accès rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="Zap" className="text-cyan-600 mr-2" />
            Accès Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => onNavigate('reportIncident')}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <Icon name="AlertCircle" className="text-red-500 mb-2" />
              <div className="font-semibold">Signaler Incident</div>
            </button>
            <button
              onClick={() => onNavigate('visitorLog')}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <Icon name="BookUser" className="text-blue-500 mb-2" />
              <div className="font-semibold">Visiteurs</div>
            </button>
            <button
              onClick={() => onNavigate('myTasks')}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <Icon name="ClipboardList" className="text-purple-500 mb-2" />
              <div className="font-semibold">Mes Tâches</div>
            </button>
            <button
              onClick={() => onNavigate('personalInfo')}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <Icon name="User" className="text-gray-500 mb-2" />
              <div className="font-semibold">Mon Profil</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};



