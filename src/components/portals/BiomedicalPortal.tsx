import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/Icon";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { User, BiomedicalEquipment, MaintenanceTask } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BiomedicalPortalProps {
  user: User;
  biomedicalEquipment: BiomedicalEquipment[];
  maintenanceTasks: MaintenanceTask[];
  onNavigate: (tabId: string) => void;
}

const getUpcomingTasks = (tasks: MaintenanceTask[]) => {
  const now = new Date();
  return tasks
    .filter(task => {
      const scheduled = new Date(task.scheduled_date);
      return scheduled >= new Date(now.toDateString()) && task.status !== 'terminée' && task.status !== 'annulée';
    })
    .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
    .slice(0, 4);
};

const getOverdueTasks = (tasks: MaintenanceTask[]) => {
  const now = new Date();
  return tasks.filter(task => new Date(task.scheduled_date) < new Date(now.toDateString()) && task.status !== 'terminée' && task.status !== 'annulée');
};

export const BiomedicalPortal = ({ user, biomedicalEquipment, maintenanceTasks, onNavigate }: BiomedicalPortalProps) => {
  const stats = {
    total: biomedicalEquipment.length,
    operational: biomedicalEquipment.filter(eq => eq.status === 'opérationnel').length,
    maintenance: biomedicalEquipment.filter(eq => eq.status === 'en_maintenance').length,
    outOfService: biomedicalEquipment.filter(eq => eq.status === 'hors_service').length,
  };

  const upcomingTasks = getUpcomingTasks(maintenanceTasks);
  const overdueTasks = getOverdueTasks(maintenanceTasks);

  const equipmentMap = biomedicalEquipment.reduce<Record<string, BiomedicalEquipment>>((acc, equipment) => {
    acc[equipment.id] = equipment;
    return acc;
  }, {});

  const today = new Date();

  return (
    <div className="space-y-8 fade-in">
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white p-8 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-3">
              <Icon name="HeartPulse" className="text-4xl mr-3" />
              <h1 className="text-4xl font-bold">Portail Biomédical</h1>
            </div>
            <p className="text-pink-100 text-xl">
              {user.civility} {user.first_name} {user.last_name} - Gestion des équipements biomédicaux
            </p>
            <p className="text-pink-200 mt-2">
              {format(today, "EEEE d MMMM yyyy", { locale: fr })} - {format(today, "HH:mm", { locale: fr })}
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-pink-100 text-sm uppercase tracking-wide">Suivi global</p>
            <p className="text-3xl font-bold">{stats.operational}/{stats.total}</p>
            <p className="text-pink-200 text-sm">équipements opérationnels</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Parc total"
          value={stats.total}
          iconName="Package"
          colorClass="bg-rose-100 text-rose-600"
          onClick={() => onNavigate('biomedical')}
        />
        <DashboardCard
          title="Opérationnels"
          value={stats.operational}
          iconName="Activity"
          colorClass="bg-green-100 text-green-600"
          onClick={() => onNavigate('biomedical')}
        />
        <DashboardCard
          title="En maintenance"
          value={stats.maintenance}
          iconName="Wrench"
          colorClass="bg-yellow-100 text-yellow-600"
          onClick={() => onNavigate('biomedical')}
        />
        <DashboardCard
          title="Hors service"
          value={stats.outOfService}
          iconName="AlertTriangle"
          colorClass="bg-red-100 text-red-600"
          onClick={() => onNavigate('biomedical')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icon name="CalendarClock" className="text-rose-500" />
                Interventions à venir
              </CardTitle>
              <p className="text-sm text-gray-500">Prochaines maintenances planifiées</p>
            </div>
            <button
              onClick={() => onNavigate('biomedical')}
              className="text-sm text-rose-600 hover:text-rose-700 font-semibold"
            >
              Voir tout
            </button>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <div className="text-sm text-gray-500">Aucune maintenance planifiée prochainement.</div>
            ) : (
              <ul className="space-y-3">
                {upcomingTasks.map(task => {
                  const equipment = equipmentMap[task.equipment_id];
                  return (
                    <li key={task.id} className="p-4 rounded-lg bg-rose-50 border border-rose-100">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{equipment?.name || 'Équipement'}</p>
                          <p className="text-sm text-gray-600">{task.description || 'Maintenance programmée'}</p>
                        </div>
                        <span className="text-xs uppercase font-semibold text-rose-600 bg-rose-100 rounded-full px-3 py-1">
                          {task.type}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Icon name="Calendar" className="h-4 w-4" />
                          {format(new Date(task.scheduled_date), "dd MMMM yyyy HH:mm", { locale: fr })}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Icon name="User" className="h-4 w-4" />
                          {task.technician_id ? `Technicien #${task.technician_id.slice(0, 6)}` : 'Non assigné'}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Icon name="AlertOctagon" className="text-orange-500" />
              Interventions en retard
            </CardTitle>
            <p className="text-sm text-gray-500">Maintenance à replanifier ou prioriser</p>
          </CardHeader>
          <CardContent>
            {overdueTasks.length === 0 ? (
              <div className="text-sm text-gray-500">Aucune intervention en retard. Tout est à jour !</div>
            ) : (
              <ul className="space-y-3">
                {overdueTasks.slice(0, 4).map(task => {
                  const equipment = equipmentMap[task.equipment_id];
                  return (
                    <li key={task.id} className="p-4 rounded-lg border border-orange-200 bg-orange-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{equipment?.name || 'Équipement'}</p>
                          <p className="text-sm text-gray-600">{task.description || 'Maintenance à effectuer'}</p>
                        </div>
                        <span className="text-xs uppercase font-semibold text-orange-600 bg-white rounded-full px-3 py-1 border border-orange-300">
                          {task.type}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm text-orange-700">
                        <div className="flex items-center gap-2">
                          <Icon name="Clock" className="h-4 w-4" />
                          {format(new Date(task.scheduled_date), "dd MMMM yyyy", { locale: fr })}
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="AlertCircle" className="h-4 w-4" />
                          Statut: {task.status}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover cursor-pointer" onClick={() => onNavigate('biomedical')}>
          <CardContent className="p-6">
            <Icon name="HeartPulse" className="text-rose-600 mb-3 text-3xl" />
            <h3 className="font-semibold mb-2">Gestion du parc</h3>
            <p className="text-sm text-gray-600">Suivre et mettre à jour vos équipements</p>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer" onClick={() => onNavigate('planningTasks')}>
          <CardContent className="p-6">
            <Icon name="CalendarPlus" className="text-purple-600 mb-3 text-3xl" />
            <h3 className="font-semibold mb-2">Planification</h3>
            <p className="text-sm text-gray-600">Planifier les interventions préventives</p>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer" onClick={() => onNavigate('maintenanceHistory')}>
          <CardContent className="p-6">
            <Icon name="History" className="text-blue-600 mb-3 text-3xl" />
            <h3 className="font-semibold mb-2">Historique</h3>
            <p className="text-sm text-gray-600">Consulter les interventions réalisées</p>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer" onClick={() => onNavigate('kpiDashboard')}>
          <CardContent className="p-6">
            <Icon name="BarChart3" className="text-green-600 mb-3 text-3xl" />
            <h3 className="font-semibold mb-2">Indicateurs</h3>
            <p className="text-sm text-gray-600">Piloter la performance biomédicale</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};




