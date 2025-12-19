import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/Icon";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { User, Incident, Visitor, PlannedTask, Booking, Notification, Users } from "@/types";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

// Portail Super Admin
export const SuperAdminPortal = ({ user, incidents, visitors, plannedTasks, bookings, notifications, users, onNavigate }: PortalProps) => {
  const today = new Date();
  const todayStr = today.toDateString();
  
  const stats = {
    totalUsers: users ? Object.keys(users).length : 0,
    todayIncidents: incidents.filter(i => new Date(i.date_creation).toDateString() === todayStr).length,
    todayVisitors: visitors.filter(v => new Date(v.entry_time).toDateString() === todayStr).length,
    activeBookings: bookings.filter(b => b.status === 'réservé' || b.status === 'en_cours').length,
    unreadNotifications: notifications.filter(n => !n.read).length,
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
  const weekData = last7Days.map(day => ({
    name: format(day, 'eee', { locale: fr }),
    incidents: incidents.filter(i => format(i.date_creation, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length,
    visitors: visitors.filter(v => format(v.entry_time, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length,
  }));

  return (
    <div className="space-y-8 fade-in">
      {/* En-tête personnalisé */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white p-8 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-3">
              <Icon name="Crown" className="text-4xl mr-3" />
              <h1 className="text-4xl font-bold">Portail Super Admin</h1>
            </div>
            <p className="text-amber-100 text-xl">
              {user.civility} {user.first_name} {user.last_name} - Vue d'ensemble complète
            </p>
            <p className="text-amber-200 mt-2">
              {format(today, "EEEE d MMMM yyyy", { locale: fr })} - {format(today, "HH:mm")}
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <DashboardCard 
          title="Utilisateurs Actifs" 
          value={stats.totalUsers} 
          iconName="Users" 
          colorClass="bg-blue-100 text-blue-600"
          onClick={() => onNavigate('settings')}
        />
        <DashboardCard 
          title="Incidents Aujourd'hui" 
          value={stats.todayIncidents} 
          iconName="AlertCircle" 
          colorClass="bg-red-100 text-red-600"
          onClick={() => onNavigate('dashboardQHSE')}
        />
        <DashboardCard 
          title="Visiteurs Aujourd'hui" 
          value={stats.todayVisitors} 
          iconName="UserCheck" 
          colorClass="bg-green-100 text-green-600"
          onClick={() => onNavigate('visitorLog')}
        />
        <DashboardCard 
          title="Réservations Actives" 
          value={stats.activeBookings} 
          iconName="Calendar" 
          colorClass="bg-purple-100 text-purple-600"
          onClick={() => onNavigate('planningSalles')}
        />
        <DashboardCard 
          title="Notifications" 
          value={stats.unreadNotifications} 
          iconName="Bell" 
          colorClass="bg-orange-100 text-orange-600"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité des 7 Derniers Jours</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="incidents" stroke="#0891B2" strokeWidth={2} name="Incidents" />
                <Line type="monotone" dataKey="visitors" stroke="#0D9488" strokeWidth={2} name="Visiteurs" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accès Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onNavigate('dashboardSuperadmin')}
                className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-lg hover:shadow-lg transition-all text-left"
              >
                <Icon name="LayoutDashboard" className="text-cyan-600 mb-2" />
                <div className="font-semibold text-gray-900">Dashboard Global</div>
                <div className="text-sm text-gray-600">Vue d'ensemble complète</div>
              </button>
              <button
                onClick={() => onNavigate('settings')}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg hover:shadow-lg transition-all text-left"
              >
                <Icon name="Settings" className="text-purple-600 mb-2" />
                <div className="font-semibold text-gray-900">Gestion Utilisateurs</div>
                <div className="text-sm text-gray-600">Gérer les comptes</div>
              </button>
              <button
                onClick={() => onNavigate('kpiDashboard')}
                className="p-4 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg hover:shadow-lg transition-all text-left"
              >
                <Icon name="BarChart" className="text-green-600 mb-2" />
                <div className="font-semibold text-gray-900">KPIs</div>
                <div className="text-sm text-gray-600">Indicateurs de performance</div>
              </button>
              <button
                onClick={() => onNavigate('portalBiomedical')}
                className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg hover:shadow-lg transition-all text-left"
              >
                <Icon name="HeartPulse" className="text-orange-600 mb-2" />
                <div className="font-semibold text-gray-900">Biomédical</div>
                <div className="text-sm text-gray-600">Équipements médicaux</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

