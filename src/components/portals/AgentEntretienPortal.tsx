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

// Portail Agent d'Entretien
export const AgentEntretienPortal = ({ user, incidents, plannedTasks, notifications, onNavigate }: PortalProps) => {
  const today = new Date();
  const todayStr = today.toDateString();
  
  const maintenanceIncidents = incidents.filter(i => i.service === 'entretien');
  const qhseIncidents = incidents.filter(i => i.service === 'entretien' || i.service === 'technique');
  const unreadNotifications = notifications.filter(n => !n.read);
  
  const stats = {
    todayIncidents: maintenanceIncidents.filter(i => new Date(i.date_creation).toDateString() === todayStr).length,
    assigned: maintenanceIncidents.filter(i => i.assigned_to === user.id && i.statut !== 'resolu').length,
    completed: maintenanceIncidents.filter(i => i.assigned_to === user.id && i.statut === 'resolu').length,
    urgent: maintenanceIncidents.filter(i => (i.priorite === 'haute' || i.priorite === 'critique') && i.assigned_to === user.id).length,
    myTasks: plannedTasks.filter(t => t.assigned_to === user.id && t.status === 'à faire').length,
    qhseTickets: qhseIncidents.filter(i => i.statut === 'nouveau' || i.statut === 'attente').length,
  };

  return (
    <div className="space-y-8 fade-in">
      {/* En-tête personnalisé */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 text-white p-8 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-3">
              <Icon name="SprayCan" className="text-4xl mr-3" />
              <h1 className="text-4xl font-bold">Portail Entretien QHSE</h1>
            </div>
            <p className="text-cyan-100 text-xl">
              {user.civility} {user.first_name} {user.last_name}
            </p>
            <p className="text-cyan-200 mt-2">
              {format(today, "EEEE d MMMM yyyy", { locale: fr })} - {format(today, "HH:mm")}
            </p>
          </div>
          {unreadNotifications.length > 0 && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <Icon name="Bell" className="text-3xl mb-2 mx-auto" />
              <div className="text-3xl font-bold">{unreadNotifications.length}</div>
              <div className="text-sm text-cyan-100">Notification{unreadNotifications.length > 1 ? 's' : ''}</div>
            </div>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Tâches Assignées" 
          value={stats.assigned} 
          iconName="ClipboardList" 
          colorClass="bg-cyan-100 text-cyan-600"
          onClick={() => onNavigate('dashboardEntretien')}
        />
        <DashboardCard 
          title="Terminées Aujourd'hui" 
          value={stats.completed} 
          iconName="CheckCircle2" 
          colorClass="bg-green-100 text-green-600"
          onClick={() => onNavigate('maintenanceHistory')}
        />
        <DashboardCard 
          title="Tickets QHSE" 
          value={stats.qhseTickets} 
          iconName="Ticket" 
          colorClass="bg-blue-100 text-blue-600"
          onClick={() => onNavigate('qhseTickets')}
        />
        <DashboardCard 
          title="Tâches Planifiées" 
          value={stats.myTasks} 
          iconName="Calendar" 
          colorClass="bg-teal-100 text-teal-600"
          onClick={() => onNavigate('myTasks')}
        />
      </div>

      {/* Accès rapide */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="Zap" className="text-cyan-600 mr-2" />
            Accès Rapide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="card-hover cursor-pointer" onClick={() => onNavigate('reportIncident')}>
              <CardContent className="p-6">
                <Icon name="AlertCircle" className="text-red-600 mb-3 text-3xl" />
                <h3 className="font-semibold mb-2">Signaler Problème</h3>
                <p className="text-sm text-gray-600">Déclarer un problème</p>
              </CardContent>
            </Card>
            <Card className="card-hover cursor-pointer" onClick={() => onNavigate('dashboardEntretien')}>
              <CardContent className="p-6">
                <Icon name="ListChecks" className="text-cyan-600 mb-3 text-3xl" />
                <h3 className="font-semibold mb-2">Mes Tâches</h3>
                <p className="text-sm text-gray-600">Tâches assignées</p>
              </CardContent>
            </Card>
            <Card className="card-hover cursor-pointer" onClick={() => onNavigate('dashboardQHSE')}>
              <CardContent className="p-6">
                <Icon name="UserCog" className="text-blue-600 mb-3 text-3xl" />
                <h3 className="font-semibold mb-2">Dashboard QHSE</h3>
                <p className="text-sm text-gray-600">Vue d'ensemble</p>
              </CardContent>
            </Card>
            <Card className="card-hover cursor-pointer" onClick={() => onNavigate('qhseTickets')}>
              <CardContent className="p-6">
                <Icon name="Ticket" className="text-purple-600 mb-3 text-3xl" />
                <h3 className="font-semibold mb-2">Tickets QHSE</h3>
                <p className="text-sm text-gray-600">Voir tous les tickets</p>
              </CardContent>
            </Card>
            <Card className="card-hover cursor-pointer" onClick={() => onNavigate('maintenanceHistory')}>
              <CardContent className="p-6">
                <Icon name="History" className="text-green-600 mb-3 text-3xl" />
                <h3 className="font-semibold mb-2">Historique</h3>
                <p className="text-sm text-gray-600">Tâches terminées</p>
              </CardContent>
            </Card>
            <Card className="card-hover cursor-pointer" onClick={() => onNavigate('myTasks')}>
              <CardContent className="p-6">
                <Icon name="Calendar" className="text-teal-600 mb-3 text-3xl" />
                <h3 className="font-semibold mb-2">Tâches Planifiées</h3>
                <p className="text-sm text-gray-600">Mes tâches récurrentes</p>
              </CardContent>
            </Card>
            <Card className="card-hover cursor-pointer" onClick={() => onNavigate('personalInfo')}>
              <CardContent className="p-6">
                <Icon name="User" className="text-gray-600 mb-3 text-3xl" />
                <h3 className="font-semibold mb-2">Mon Profil</h3>
                <p className="text-sm text-gray-600">Mes informations</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Mon Activité */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="Info" className="text-cyan-600 mr-2" />
            Mon Activité QHSE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.urgent > 0 && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex items-center">
                  <Icon name="AlertTriangle" className="text-red-600 mr-2 text-2xl" />
                  <div>
                    <div className="font-semibold text-red-900">{stats.urgent} tâche(s) urgente(s)</div>
                    <div className="text-sm text-red-700">À traiter en priorité</div>
                  </div>
                </div>
              </div>
            )}
            {stats.qhseTickets > 0 && (
              <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                <div className="flex items-center">
                  <Icon name="Ticket" className="text-purple-600 mr-2 text-2xl" />
                  <div>
                    <div className="font-semibold text-purple-900">{stats.qhseTickets} ticket(s) QHSE</div>
                    <div className="text-sm text-purple-700">En attente de traitement</div>
                  </div>
                </div>
              </div>
            )}
            {stats.assigned > 0 && (
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <div className="flex items-center">
                  <Icon name="Clock" className="text-blue-600 mr-2 text-2xl" />
                  <div>
                    <div className="font-semibold text-blue-900">{stats.assigned} tâche(s) assignée(s)</div>
                    <div className="text-sm text-blue-700">En cours de traitement</div>
                  </div>
                </div>
              </div>
            )}
            {stats.completed > 0 && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <div className="flex items-center">
                  <Icon name="CheckCircle2" className="text-green-600 mr-2 text-2xl" />
                  <div>
                    <div className="font-semibold text-green-900">{stats.completed} tâche(s) terminée(s)</div>
                    <div className="text-sm text-green-700">Aujourd'hui</div>
                  </div>
                </div>
              </div>
            )}
            {stats.assigned === 0 && stats.qhseTickets === 0 && stats.urgent === 0 && (
              <div className="p-4 bg-gray-50 border-l-4 border-gray-300 rounded-lg col-span-2">
                <div className="flex items-center">
                  <Icon name="CheckCircle2" className="text-gray-400 mr-2 text-2xl" />
                  <div className="text-gray-600">Aucune tâche en attente. Excellent travail !</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

