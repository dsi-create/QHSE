import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/Icon";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { User, Visitor, Booking, Notification } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PortalProps {
  user: User;
  visitors: Visitor[];
  bookings: Booking[];
  notifications: Notification[];
  onNavigate: (tabId: string) => void;
}

// Portail Secrétaire
export const SecretairePortal = ({ user, visitors, bookings, notifications, onNavigate }: PortalProps) => {
  const today = new Date();
  const todayStr = today.toDateString();
  
  const stats = {
    todayVisitors: visitors.filter(v => new Date(v.entry_time).toDateString() === todayStr).length,
    activeVisitors: visitors.filter(v => !v.exit_time).length,
    todayBookings: bookings.filter(b => format(new Date(b.start_time), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')).length,
    activeBookings: bookings.filter(b => b.status === 'réservé' || b.status === 'en_cours').length,
  };

  return (
    <div className="space-y-8 fade-in">
      {/* En-tête personnalisé */}
      <div className="bg-gradient-to-r from-pink-600 via-pink-700 to-rose-600 text-white p-8 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-3">
              <Icon name="FileText" className="text-4xl mr-3" />
              <h1 className="text-4xl font-bold">Portail Secrétaire</h1>
            </div>
            <p className="text-pink-100 text-xl">
              {user.civility} {user.first_name} {user.last_name}
            </p>
            <p className="text-pink-200 mt-2">
              {format(today, "EEEE d MMMM yyyy", { locale: fr })} - {format(today, "HH:mm")}
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Visiteurs Aujourd'hui" 
          value={stats.todayVisitors} 
          iconName="Users" 
          colorClass="bg-green-100 text-green-600"
          onClick={() => onNavigate('visitorLog')}
        />
        <DashboardCard 
          title="Visiteurs Actifs" 
          value={stats.activeVisitors} 
          iconName="UserCheck" 
          colorClass="bg-blue-100 text-blue-600"
          onClick={() => onNavigate('visitorLog')}
        />
        <DashboardCard 
          title="Réservations Aujourd'hui" 
          value={stats.todayBookings} 
          iconName="Calendar" 
          colorClass="bg-purple-100 text-purple-600"
          onClick={() => onNavigate('planningSalles')}
        />
        <DashboardCard 
          title="Réservations Actives" 
          value={stats.activeBookings} 
          iconName="CalendarCheck" 
          colorClass="bg-orange-100 text-orange-600"
          onClick={() => onNavigate('planningSalles')}
        />
      </div>

      {/* Accès rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-hover cursor-pointer" onClick={() => onNavigate('visitorLog')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="BookUser" className="text-green-600 mr-2" />
              Registre Visiteurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Gérer l'entrée et la sortie des visiteurs</p>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Icon name="Check" className="text-green-600 mr-2" />
                Enregistrer les entrées
              </div>
              <div className="flex items-center text-sm">
                <Icon name="Check" className="text-green-600 mr-2" />
                Enregistrer les sorties
              </div>
              <div className="flex items-center text-sm">
                <Icon name="Check" className="text-green-600 mr-2" />
                Consulter l'historique
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover cursor-pointer" onClick={() => onNavigate('planningSalles')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="Calendar" className="text-purple-600 mr-2" />
              Planning des Salles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Gérer les réservations de salles</p>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Icon name="Check" className="text-purple-600 mr-2" />
                Créer des réservations
              </div>
              <div className="flex items-center text-sm">
                <Icon name="Check" className="text-purple-600 mr-2" />
                Modifier les réservations
              </div>
              <div className="flex items-center text-sm">
                <Icon name="Check" className="text-purple-600 mr-2" />
                Annuler des réservations
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};



