import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/Icon";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { User, Incident, PlannedTask, Notification } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PortalProps {
  user: User;
  incidents: Incident[];
  plannedTasks: PlannedTask[];
  notifications: Notification[];
  onNavigate: (tabId: string) => void;
}

// Portail Technicien
export const TechnicienPortal = ({ user, incidents, plannedTasks, notifications, onNavigate }: PortalProps) => {
  const today = new Date();
  const todayStr = today.toDateString();
  
  const technicalIncidents = incidents.filter(i => i.service === 'technique');
  const qhseIncidents = incidents.filter(i => i.service === 'technique' || i.service === 'entretien');
  const myInterventions = technicalIncidents.filter(i => i.assigned_to === user.id);
  const stats = {
    assigned: myInterventions.filter(i => i.statut !== 'resolu' && i.statut !== 'traite').length,
    inProgress: myInterventions.filter(i => i.statut === 'cours').length,
    completed: myInterventions.filter(i => i.statut === 'resolu' || i.statut === 'traite').length,
    urgent: myInterventions.filter(i => (i.priorite === 'haute' || i.priorite === 'critique') && i.statut !== 'resolu').length,
    myTasks: plannedTasks.filter(t => t.assigned_to === user.id && t.status === 'à faire').length,
    qhseTickets: qhseIncidents.filter(i => i.statut === 'nouveau' || i.statut === 'attente').length,
  };

  return (
    <div className="space-y-8 fade-in">
      {/* En-tête personnalisé */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-red-600 text-white p-8 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-3">
              <Icon name="Wrench" className="text-4xl mr-3" />
              <h1 className="text-4xl font-bold">Portail Technique QHSE</h1>
            </div>
            <p className="text-orange-100 text-xl">
              {user.civility} {user.first_name} {user.last_name}
            </p>
            <p className="text-orange-200 mt-2">
              {format(today, "EEEE d MMMM yyyy", { locale: fr })} - {format(today, "HH:mm")}
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Interventions Assignées" 
          value={stats.assigned} 
          iconName="ClipboardList" 
          colorClass="bg-blue-100 text-blue-600"
          onClick={() => onNavigate('dashboardTechnicien')}
        />
        <DashboardCard 
          title="En Cours" 
          value={stats.inProgress} 
          iconName="Clock" 
          colorClass="bg-yellow-100 text-yellow-600"
          onClick={() => onNavigate('dashboardTechnicien')}
        />
        <DashboardCard 
          title="Tickets QHSE" 
          value={stats.qhseTickets} 
          iconName="Ticket" 
          colorClass="bg-purple-100 text-purple-600"
          onClick={() => onNavigate('qhseTickets')}
        />
        <DashboardCard 
          title="Terminées" 
          value={stats.completed} 
          iconName="CheckCircle2" 
          colorClass="bg-green-100 text-green-600"
        />
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="Zap" className="text-orange-600 mr-2" />
              Mes Interventions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('dashboardTechnicien')}
                className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-all text-left flex items-center"
              >
                <Icon name="ClipboardCheck" className="text-blue-600 mr-3" />
                <div>
                  <div className="font-semibold text-gray-900">Interventions Assignées</div>
                  <div className="text-sm text-gray-600">Voir mes interventions techniques</div>
                </div>
              </button>
              <button
                onClick={() => onNavigate('dashboardQHSE')}
                className="w-full p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition-all text-left flex items-center"
              >
                <Icon name="UserCog" className="text-purple-600 mr-3" />
                <div>
                  <div className="font-semibold text-gray-900">Dashboard QHSE</div>
                  <div className="text-sm text-gray-600">Vue d'ensemble QHSE</div>
                </div>
              </button>
              <button
                onClick={() => onNavigate('qhseTickets')}
                className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-all text-left flex items-center"
              >
                <Icon name="Ticket" className="text-blue-600 mr-3" />
                <div>
                  <div className="font-semibold text-gray-900">Tickets QHSE</div>
                  <div className="text-sm text-gray-600">Voir tous les tickets</div>
                </div>
              </button>
              {stats.inProgress > 0 && (
                <button
                  onClick={() => onNavigate('dashboardTechnicien')}
                  className="w-full p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg hover:bg-yellow-100 transition-all text-left flex items-center"
                >
                  <Icon name="Play" className="text-yellow-600 mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">{stats.inProgress} intervention(s) en cours</div>
                    <div className="text-sm text-gray-600">Continuer ou terminer</div>
                  </div>
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="Info" className="text-cyan-600 mr-2" />
              Informations QHSE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.urgent > 0 && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                  <div className="flex items-center">
                    <Icon name="AlertTriangle" className="text-red-600 mr-2" />
                    <span className="font-semibold text-red-900">{stats.urgent} intervention(s) urgente(s)</span>
                  </div>
                </div>
              )}
              {stats.qhseTickets > 0 && (
                <div className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded">
                  <div className="flex items-center">
                    <Icon name="Ticket" className="text-purple-600 mr-2" />
                    <span className="font-semibold text-purple-900">{stats.qhseTickets} ticket(s) QHSE en attente</span>
                  </div>
                </div>
              )}
              {stats.inProgress > 0 && (
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <div className="flex items-center">
                    <Icon name="Clock" className="text-yellow-600 mr-2" />
                    <span className="font-semibold text-yellow-900">{stats.inProgress} intervention(s) en cours</span>
                  </div>
                </div>
              )}
              {stats.completed > 0 && (
                <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                  <div className="flex items-center">
                    <Icon name="CheckCircle2" className="text-green-600 mr-2" />
                    <span className="font-semibold text-green-900">{stats.completed} intervention(s) terminée(s)</span>
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

