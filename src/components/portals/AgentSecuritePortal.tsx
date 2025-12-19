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

// Portail Agent de Sécurité
export const AgentSecuritePortal = ({ user, incidents, visitors, plannedTasks, notifications, onNavigate }: PortalProps) => {
  const today = new Date();
  const todayStr = today.toDateString();
  
  const securityIncidents = incidents.filter(i => i.service === 'securite');
  const stats = {
    todayIncidents: securityIncidents.filter(i => new Date(i.date_creation).toDateString() === todayStr).length,
    inProgress: securityIncidents.filter(i => i.statut === 'cours').length,
    resolved: securityIncidents.filter(i => i.statut === 'resolu').length,
    urgent: securityIncidents.filter(i => i.priorite === 'haute' || i.priorite === 'critique').length,
    todayVisitors: visitors.filter(v => new Date(v.entry_time).toDateString() === todayStr).length,
    myTasks: plannedTasks.filter(t => t.assigned_to === user.id && t.status === 'à faire').length,
  };

  return (
    <div className="space-y-8 fade-in">
      {/* En-tête personnalisé */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white p-8 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-3">
              <Icon name="Shield" className="text-4xl mr-3" />
              <h1 className="text-4xl font-bold">Portail Sécurité</h1>
            </div>
            <p className="text-blue-100 text-xl">
              {user.civility} {user.first_name} {user.last_name}
            </p>
            <p className="text-blue-200 mt-2">
              {format(today, "EEEE d MMMM yyyy", { locale: fr })} - {format(today, "HH:mm")}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-blue-100">Poste de Garde</div>
              <div className="text-2xl font-bold">Actif</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Incidents Aujourd'hui" 
          value={stats.todayIncidents} 
          iconName="AlertCircle" 
          colorClass="bg-red-100 text-red-600"
          onClick={() => onNavigate('securityIncidents')}
        />
        <DashboardCard 
          title="En Cours" 
          value={stats.inProgress} 
          iconName="Clock" 
          colorClass="bg-yellow-100 text-yellow-600"
          onClick={() => onNavigate('securityIncidents')}
        />
        <DashboardCard 
          title="Visiteurs Aujourd'hui" 
          value={stats.todayVisitors} 
          iconName="Users" 
          colorClass="bg-green-100 text-green-600"
          onClick={() => onNavigate('visitorLog')}
        />
        <DashboardCard 
          title="Mes Tâches" 
          value={stats.myTasks} 
          iconName="ClipboardList" 
          colorClass="bg-purple-100 text-purple-600"
          onClick={() => onNavigate('myTasks')}
        />
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="Zap" className="text-blue-600 mr-2" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('reportIncident')}
                className="w-full p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-all text-left flex items-center"
              >
                <Icon name="AlertCircle" className="text-red-600 mr-3" />
                <div>
                  <div className="font-semibold text-gray-900">Signaler un Incident</div>
                  <div className="text-sm text-gray-600">Déclarer un incident de sécurité</div>
                </div>
              </button>
              <button
                onClick={() => onNavigate('visitorLog')}
                className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-all text-left flex items-center"
              >
                <Icon name="BookUser" className="text-blue-600 mr-3" />
                <div>
                  <div className="font-semibold text-gray-900">Registre Visiteurs</div>
                  <div className="text-sm text-gray-600">Enregistrer entrée/sortie</div>
                </div>
              </button>
              <button
                onClick={() => onNavigate('securityIncidents')}
                className="w-full p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg hover:bg-yellow-100 transition-all text-left flex items-center"
              >
                <Icon name="ListChecks" className="text-yellow-600 mr-3" />
                <div>
                  <div className="font-semibold text-gray-900">Liste des Incidents</div>
                  <div className="text-sm text-gray-600">Consulter tous les incidents</div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="Info" className="text-cyan-600 mr-2" />
              Informations Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.urgent > 0 && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                  <div className="flex items-center">
                    <Icon name="AlertTriangle" className="text-red-600 mr-2" />
                    <span className="font-semibold text-red-900">{stats.urgent} incident(s) urgent(s)</span>
                  </div>
                </div>
              )}
              {stats.inProgress > 0 && (
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <div className="flex items-center">
                    <Icon name="Clock" className="text-yellow-600 mr-2" />
                    <span className="font-semibold text-yellow-900">{stats.inProgress} incident(s) en cours</span>
                  </div>
                </div>
              )}
              {stats.myTasks > 0 && (
                <div className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded">
                  <div className="flex items-center">
                    <Icon name="ClipboardList" className="text-purple-600 mr-2" />
                    <span className="font-semibold text-purple-900">{stats.myTasks} tâche(s) assignée(s)</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};



